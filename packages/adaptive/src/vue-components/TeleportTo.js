/**
 * Adaptive Teleport
 * @module
 * @example <teleport-to target="" position=""></teleport-to>
 * @property {String|Object} target
 * @property {String} target
 */
export default {
    name: 'TeleportTo',
    inheritAttrs: false,
    props: {
        target: {
            type: [String, Object],
            require: true,
        },
        position: {
            type: String,
            default: 'to',
            require: false,
        },
    },
    setup(props) {
        const directive = `${props.position}(${props.target})`;
        return {
            directive,
        };
    },
    template: `
        <div>
            <div v-teleport-to="directive">
                <slot></slot>
            </div>
        </div>
    `,
};
