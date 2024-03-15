import Teleport from '../Teleport.js';

class TeleportTo extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        let target = this.getAttribute('target');
        let position = this.getAttribute('position') ?? 'to';
        let dId = this.getAttribute('data-adaptive-id');

        if (target && !dId) {
            return new Teleport(this).beam(`${position}(${target})`);
        }
    }
}
export default function componentTeleportTo() {
    customElements.define('teleport-to', TeleportTo);
}
