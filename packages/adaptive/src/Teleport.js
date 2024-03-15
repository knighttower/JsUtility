// author Knighttower
//  MIT License
//  Copyright (c) [2022] [Knighttower] https://github.com/knighttower
import { selectElement, DomObserver, getDirectivesFromString as GetSettings, typeOf } from '@knighttower/utility';
import { validType } from '@knighttower/type-check';

/**
 * @module Teleport
 * Teleport an element to another place in the DOM before, inside or after a target
 * @param {Object|String} props || selector - props object (domElement: element, adaptiveId: null|uniqueId})
 * @example new Teleport({domElement: element, adaptiveId: uniqueId}).beam({to: selector})
 * @example new Teleport(domElement).beam({after: selector})
 * @example new Teleport(domElement).beam({before: selector})
 * @example new Teleport(domElement).beam(selector) // defaults to "to" which is inside the selector
 * @example const eleTeleport = new Teleport(domElement) // returns the object with eleTeleport{beam(String|Object), back(), cancel()}
 * @example Make it global so that is available in the browser and works as a 'window' library
 *   TeleportGlobal()
 *      - <div data-teleport="selector"></div>
 *      - <div data-teleport="{before: 'selector'}"></div>
 *     - <div data-teleport="{after: 'selector'}"></div>
 * @feature If the target (element where it will be sent to) is not in the DOM it will wait until it is and then it will beam the element
 * @return {Object} Teleport object
 */
class Teleport {
    /**
     * Constructor
     * @param {String|Object} selector || props object (see AdaptiveElement)
     * @return {Object}
     */
    constructor(props) {
        // Early exit if no props are provided
        if (!validType(props, 'string|object')) {
            return;
        }

        this.props = props;
        if (!this.props.adaptiveId) {
            const element = selectElement(this.props);
            const attrId = element.getAttribute('data-adaptive-id') ?? null;
            // If adaptiveId is not present, create or retrieve it
            const uniqueId = attrId || element.getHash();
            if (!attrId) {
                element.domElement.setAttribute('data-adaptive-id', uniqueId);
            }

            // Update props with additional properties
            this.props = Object.assign({}, this.props, {
                adaptiveId: uniqueId,
                helper: element,
                domElement: element.domElement,
                xpath: element.getXpathTo(),
            });
        }

        let placeholder = selectElement(`[name="adaptive"][value="${this.props.adaptiveId}"`);
        if (!placeholder.isInDom()) {
            placeholder = document.createElement('param');
            placeholder.name = 'adaptive';
            placeholder.value = this.props.adaptiveId;
            this.props.domElement.insertAdjacentElement('beforebegin', placeholder);
        }
    }

    /**
     * Beam the element to another place in the DOM
     * This method will look for the "tagert" element if it is in the DOM and it will querying the DOM until it finds it
     * if the target is not found call the cancel() method to stop the observer
     * @param {String|Object} target (selector) directive defaults to "to" || {to|after|before: target}
     * @example new Teleport(domElement).beam({after: selector})
     * @example domElement.beam({after: selector})
     */
    beam(settings) {
        settings = GetSettings(settings).directive;

        // Transform settings to an array format
        switch (typeOf(settings)) {
            case 'string':
                settings = ['default', settings];
                break;
            case 'object':
                // eslint-disable-next-line no-case-declarations
                const key = Object.keys(settings)[0];
                settings = [key, settings[key]];
                break;
            case 'array':
                if (settings.length === 1) {
                    settings = ['default', settings[0]];
                }
                break;
        }

        const [direction, selector] = settings;
        const target = selectElement(selector);
        let position = 'beforeend';

        switch (direction) {
            case 'before':
                position = 'beforebegin';
                break;
            case 'after':
                position = 'afterend';
                break;
        }

        if (target.isInDom()) {
            target.domElement.insertAdjacentElement(position, this.props.domElement);
            return;
        }

        // Add observer if the target is not in the DOM
        DomObserver.addOnNodeChange(this.props.adaptiveId, () => {
            const observedTarget = selectElement(selector);
            if (observedTarget.isInDom()) {
                observedTarget.domElement.insertAdjacentElement(position, this.props.domElement);
                DomObserver.removeOnNodeChange(this.props.adaptiveId);
            }
        });
    }

    /**
     * Return to its original place
     * @example new Teleport(domElement).back()
     * @example domElement.back()
     */
    back() {
        let target = selectElement(`[name="adaptive"][value="${this.props.adaptiveId}"`);
        if (target.isInDom()) {
            target.domElement.insertAdjacentElement('afterend', this.props.domElement);
            // target.domElement.remove();
        }
    }

    /**
     * If element target is no it the DOM and needs to cancel the observer
     * @example new Teleport(domElement).cancel()
     * @example domElement.cancel()
     */
    cancel() {
        DomObserver.removeOnNodeChange(this.props.adaptiveId);
    }
}

// Storage
let TeleportIsGlobal = false;

/**
 * Warning, this will make it global and would work with data attr like data-teleport
 * @example new Teleport().global()
 */
function TeleportGlobal() {
    // Exit if already initialized
    if (TeleportIsGlobal) {
        return;
    }

    // Use forEach directly on NodeList
    document.querySelectorAll('[data-teleport]').forEach((element) => {
        new Teleport(element).beam(element.getAttribute('data-teleport'));
    });

    // Mark as initialized
    TeleportIsGlobal = true;
}

export { Teleport, TeleportGlobal, Teleport as default, Teleport as teleport };
