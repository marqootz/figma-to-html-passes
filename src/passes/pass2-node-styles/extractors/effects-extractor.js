/**
 * Effects extractor for extracting shadow/blur effects from Figma nodes
 */

const { rgbaToHex } = require('../utils/color-utils');

/**
 * Extract effects (shadows, blurs) from a node
 * @param {Object} node - Figma node
 * @returns {Array} Array of effects
 */
function extractEffects(node) {
    if (!node.effects || !Array.isArray(node.effects)) {
        return [];
    }

    return node.effects.map(effect => {
        const effectStyle = {
            type: effect.type,
            visible: effect.visible !== false
        };

        switch (effect.type) {
            case 'DROP_SHADOW':
            case 'INNER_SHADOW':
                effectStyle.color = rgbaToHex(effect.color);
                effectStyle.offset = effect.offset;
                effectStyle.radius = effect.radius;
                effectStyle.spread = effect.spread;
                break;
            case 'LAYER_BLUR':
            case 'BACKGROUND_BLUR':
                effectStyle.radius = effect.radius;
                break;
        }

        return effectStyle;
    });
}

module.exports = {
    extractEffects
};
