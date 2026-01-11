/**
 * Sample Figma Data for Testing
 * 
 * This file contains sample Figma node data and reactions to test the multi-pass system.
 */

// Sample Figma nodes representing a simple button component with variants
const sampleFigmaNodes = [
    {
        id: "frame-1",
        name: "Button Component Set",
        type: "COMPONENT_SET",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        absoluteBoundingBox: {
            x: 0,
            y: 0,
            width: 400,
            height: 200
        },
        layoutMode: "VERTICAL",
        primaryAxisAlignItems: "CENTER",
        counterAxisAlignItems: "CENTER",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        itemSpacing: 16,
        fills: [
            {
                type: "SOLID",
                visible: true,
                opacity: 1,
                color: { r: 0.95, g: 0.95, b: 0.95 }
            }
        ],
        children: [
            {
                id: "button-primary",
                name: "Primary Button",
                type: "COMPONENT",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 20,
                    y: 20,
                    width: 120,
                    height: 40
                },
                fills: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 0.2, g: 0.5, b: 1.0 }
                    }
                ],
                cornerRadius: 8,
                strokes: [],
                effects: [
                    {
                        type: "DROP_SHADOW",
                        visible: true,
                        radius: 4,
                        color: { r: 0, g: 0, b: 0, a: 0.1 },
                        offset: { x: 0, y: 2 }
                    }
                ],
                children: [
                    {
                        id: "button-text-primary",
                        name: "Button Text",
                        type: "TEXT",
                        visible: true,
                        opacity: 1,
                        absoluteBoundingBox: {
                            x: 30,
                            y: 30,
                            width: 100,
                            height: 20
                        },
                        characters: "Click Me",
                        style: {
                            fontFamily: "Inter",
                            fontSize: 16,
                            fontWeight: 500,
                            lineHeightPx: 20,
                            textAlignHorizontal: "CENTER",
                            textAlignVertical: "CENTER",
                            fills: [
                                {
                                    type: "SOLID",
                                    visible: true,
                                    opacity: 1,
                                    color: { r: 1, g: 1, b: 1 }
                                }
                            ]
                        },
                        textAutoResize: "WIDTH_AND_HEIGHT",
                        children: []
                    }
                ]
            },
            {
                id: "button-secondary",
                name: "Secondary Button",
                type: "COMPONENT",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 20,
                    y: 76,
                    width: 120,
                    height: 40
                },
                fills: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 1, g: 1, b: 1 }
                    }
                ],
                cornerRadius: 8,
                strokes: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 0.8, g: 0.8, b: 0.8 }
                    }
                ],
                strokeWeight: 1,
                strokeAlign: "INSIDE",
                effects: [],
                children: [
                    {
                        id: "button-text-secondary",
                        name: "Button Text",
                        type: "TEXT",
                        visible: true,
                        opacity: 1,
                        absoluteBoundingBox: {
                            x: 30,
                            y: 86,
                            width: 100,
                            height: 20
                        },
                        characters: "Click Me",
                        style: {
                            fontFamily: "Inter",
                            fontSize: 16,
                            fontWeight: 500,
                            lineHeightPx: 20,
                            textAlignHorizontal: "CENTER",
                            textAlignVertical: "CENTER",
                            fills: [
                                {
                                    type: "SOLID",
                                    visible: true,
                                    opacity: 1,
                                    color: { r: 0.2, g: 0.2, b: 0.2 }
                                }
                            ]
                        },
                        textAutoResize: "WIDTH_AND_HEIGHT",
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: "frame-2",
        name: "Content Frame",
        type: "FRAME",
        visible: true,
        opacity: 1,
        absoluteBoundingBox: {
            x: 0,
            y: 220,
            width: 400,
            height: 300
        },
        layoutMode: "VERTICAL",
        primaryAxisAlignItems: "CENTER",
        counterAxisAlignItems: "CENTER",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
        itemSpacing: 24,
        fills: [
            {
                type: "SOLID",
                visible: true,
                opacity: 1,
                color: { r: 1, g: 1, b: 1 }
            }
        ],
        children: [
            {
                id: "title-text",
                name: "Title",
                type: "TEXT",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 40,
                    y: 260,
                    width: 320,
                    height: 32
                },
                characters: "Welcome to Our App",
                style: {
                    fontFamily: "Inter",
                    fontSize: 24,
                    fontWeight: 600,
                    lineHeightPx: 32,
                    textAlignHorizontal: "CENTER",
                    textAlignVertical: "CENTER",
                    fills: [
                        {
                            type: "SOLID",
                            visible: true,
                            opacity: 1,
                            color: { r: 0.1, g: 0.1, b: 0.1 }
                        }
                    ]
                },
                textAutoResize: "WIDTH_AND_HEIGHT",
                children: []
            },
            {
                id: "description-text",
                name: "Description",
                type: "TEXT",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 40,
                    y: 316,
                    width: 320,
                    height: 48
                },
                characters: "This is a sample description text that explains what the app does and how it can help users.",
                style: {
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeightPx: 24,
                    textAlignHorizontal: "CENTER",
                    textAlignVertical: "CENTER",
                    fills: [
                        {
                            type: "SOLID",
                            visible: true,
                            opacity: 1,
                            color: { r: 0.4, g: 0.4, b: 0.4 }
                        }
                    ]
                },
                textAutoResize: "WIDTH_AND_HEIGHT",
                children: []
            },
            {
                id: "icon-vector",
                name: "Icon",
                type: "VECTOR",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 180,
                    y: 388,
                    width: 40,
                    height: 40
                },
                fills: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 0.2, g: 0.5, b: 1.0 }
                    }
                ],
                vectorPaths: [
                    {
                        windingRule: "NONZERO",
                        data: "M20 4L36 20L20 36L4 20L20 4Z"
                    }
                ],
                children: []
            }
        ]
    }
];

// Sample Figma reactions for interactions
const sampleFigmaReactions = [
    {
        id: "reaction-1",
        name: "Primary Button Click",
        trigger: {
            type: "ON_CLICK",
            deviceType: "MOUSE",
            delay: 0,
            nodeId: "button-primary"
        },
        action: {
            type: "SET_VARIANT",
            componentId: "button-primary",
            variantName: "pressed"
        },
        transition: {
            type: "DISSOLVE",
            duration: 0.2,
            easing: {
                type: "EASE_IN_OUT"
            }
        }
    },
    {
        id: "reaction-2",
        name: "Secondary Button Click",
        trigger: {
            type: "ON_CLICK",
            deviceType: "MOUSE",
            delay: 0,
            nodeId: "button-secondary"
        },
        action: {
            type: "NAVIGATE",
            destination: {
                nodeId: "frame-2",
                name: "Content Frame",
                type: "NODE"
            }
        },
        transition: {
            type: "SLIDE_LEFT",
            duration: 0.3,
            easing: {
                type: "EASE_OUT"
            }
        }
    },
    {
        id: "reaction-3",
        name: "Icon Hover",
        trigger: {
            type: "ON_HOVER",
            deviceType: "MOUSE",
            delay: 0,
            nodeId: "icon-vector"
        },
        action: {
            type: "SET_PROPERTY",
            targetId: "icon-vector",
            propertyName: "scale",
            propertyValue: "1.1"
        },
        transition: {
            type: "DISSOLVE",
            duration: 0.15,
            easing: {
                type: "EASE_IN_OUT"
            }
        }
    }
];

// Sample metadata
const sampleMetadata = {
    title: "Sample Figma Prototype",
    description: "A sample prototype demonstrating the multi-pass HTML generation system",
    author: "Figma to HTML Passes",
    version: "1.0.0",
    created: new Date().toISOString(),
    figmaFileId: "sample-file-id",
    figmaFileKey: "sample-file-key"
};

// Complex sample with nested components
const complexSampleNodes = [
    {
        id: "app-frame",
        name: "App Container",
        type: "FRAME",
        visible: true,
        opacity: 1,
        absoluteBoundingBox: {
            x: 0,
            y: 0,
            width: 375,
            height: 812
        },
        layoutMode: "VERTICAL",
        primaryAxisAlignItems: "MIN",
        counterAxisAlignItems: "MIN",
        fills: [
            {
                type: "SOLID",
                visible: true,
                opacity: 1,
                color: { r: 0.98, g: 0.98, b: 0.98 }
            }
        ],
        children: [
            {
                id: "header-component-set",
                name: "Header Component Set",
                type: "COMPONENT_SET",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 0,
                    y: 0,
                    width: 375,
                    height: 88
                },
                layoutMode: "HORIZONTAL",
                primaryAxisAlignItems: "SPACE_BETWEEN",
                counterAxisAlignItems: "CENTER",
                paddingTop: 44,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
                fills: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 1, g: 1, b: 1 }
                    }
                ],
                effects: [
                    {
                        type: "DROP_SHADOW",
                        visible: true,
                        radius: 2,
                        color: { r: 0, g: 0, b: 0, a: 0.05 },
                        offset: { x: 0, y: 1 }
                    }
                ],
                children: [
                    {
                        id: "header-default",
                        name: "Default Header",
                        type: "COMPONENT",
                        visible: true,
                        opacity: 1,
                        absoluteBoundingBox: {
                            x: 16,
                            y: 44,
                            width: 343,
                            height: 32
                        },
                        children: [
                            {
                                id: "header-title",
                                name: "Header Title",
                                type: "TEXT",
                                visible: true,
                                opacity: 1,
                                absoluteBoundingBox: {
                                    x: 16,
                                    y: 52,
                                    width: 200,
                                    height: 24
                                },
                                characters: "My App",
                                style: {
                                    fontFamily: "Inter",
                                    fontSize: 20,
                                    fontWeight: 600,
                                    lineHeightPx: 24,
                                    textAlignHorizontal: "LEFT",
                                    textAlignVertical: "CENTER",
                                    fills: [
                                        {
                                            type: "SOLID",
                                            visible: true,
                                            opacity: 1,
                                            color: { r: 0.1, g: 0.1, b: 0.1 }
                                        }
                                    ]
                                },
                                textAutoResize: "WIDTH_AND_HEIGHT",
                                children: []
                            },
                            {
                                id: "header-menu-button",
                                name: "Menu Button",
                                type: "COMPONENT",
                                visible: true,
                                opacity: 1,
                                absoluteBoundingBox: {
                                    x: 319,
                                    y: 48,
                                    width: 24,
                                    height: 24
                                },
                                fills: [
                                    {
                                        type: "SOLID",
                                        visible: true,
                                        opacity: 1,
                                        color: { r: 0.2, g: 0.2, b: 0.2 }
                                    }
                                ],
                                cornerRadius: 4,
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "content-area",
                name: "Content Area",
                type: "FRAME",
                visible: true,
                opacity: 1,
                absoluteBoundingBox: {
                    x: 0,
                    y: 88,
                    width: 375,
                    height: 676
                },
                layoutMode: "VERTICAL",
                primaryAxisAlignItems: "MIN",
                counterAxisAlignItems: "MIN",
                paddingTop: 24,
                paddingBottom: 24,
                paddingLeft: 16,
                paddingRight: 16,
                itemSpacing: 16,
                fills: [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        color: { r: 0.98, g: 0.98, b: 0.98 }
                    }
                ],
                children: [
                    {
                        id: "card-component-set",
                        name: "Card Component Set",
                        type: "COMPONENT_SET",
                        visible: true,
                        opacity: 1,
                        absoluteBoundingBox: {
                            x: 16,
                            y: 112,
                            width: 343,
                            height: 120
                        },
                        layoutMode: "VERTICAL",
                        primaryAxisAlignItems: "MIN",
                        counterAxisAlignItems: "MIN",
                        paddingTop: 16,
                        paddingBottom: 16,
                        paddingLeft: 16,
                        paddingRight: 16,
                        itemSpacing: 12,
                        fills: [
                            {
                                type: "SOLID",
                                visible: true,
                                opacity: 1,
                                color: { r: 1, g: 1, b: 1 }
                            }
                        ],
                        cornerRadius: 12,
                        effects: [
                            {
                                type: "DROP_SHADOW",
                                visible: true,
                                radius: 8,
                                color: { r: 0, g: 0, b: 0, a: 0.1 },
                                offset: { x: 0, y: 4 }
                            }
                        ],
                        children: [
                            {
                                id: "card-default",
                                name: "Default Card",
                                type: "COMPONENT",
                                visible: true,
                                opacity: 1,
                                absoluteBoundingBox: {
                                    x: 32,
                                    y: 128,
                                    width: 311,
                                    height: 88
                                },
                                children: [
                                    {
                                        id: "card-title",
                                        name: "Card Title",
                                        type: "TEXT",
                                        visible: true,
                                        opacity: 1,
                                        absoluteBoundingBox: {
                                            x: 32,
                                            y: 136,
                                            width: 200,
                                            height: 20
                                        },
                                        characters: "Card Title",
                                        style: {
                                            fontFamily: "Inter",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            lineHeightPx: 20,
                                            textAlignHorizontal: "LEFT",
                                            textAlignVertical: "CENTER",
                                            fills: [
                                                {
                                                    type: "SOLID",
                                                    visible: true,
                                                    opacity: 1,
                                                    color: { r: 0.1, g: 0.1, b: 0.1 }
                                                }
                                            ]
                                        },
                                        textAutoResize: "WIDTH_AND_HEIGHT",
                                        children: []
                                    },
                                    {
                                        id: "card-description",
                                        name: "Card Description",
                                        type: "TEXT",
                                        visible: true,
                                        opacity: 1,
                                        absoluteBoundingBox: {
                                            x: 32,
                                            y: 164,
                                            width: 280,
                                            height: 40
                                        },
                                        characters: "This is a sample card description that explains what the card contains.",
                                        style: {
                                            fontFamily: "Inter",
                                            fontSize: 14,
                                            fontWeight: 400,
                                            lineHeightPx: 20,
                                            textAlignHorizontal: "LEFT",
                                            textAlignVertical: "CENTER",
                                            fills: [
                                                {
                                                    type: "SOLID",
                                                    visible: true,
                                                    opacity: 1,
                                                    color: { r: 0.4, g: 0.4, b: 0.4 }
                                                }
                                            ]
                                        },
                                        textAutoResize: "WIDTH_AND_HEIGHT",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// Complex sample reactions
const complexSampleReactions = [
    {
        id: "reaction-header-menu",
        name: "Header Menu Click",
        trigger: {
            type: "ON_CLICK",
            deviceType: "MOUSE",
            delay: 0,
            nodeId: "header-menu-button"
        },
        action: {
            type: "SET_VARIANT",
            componentId: "header-component-set",
            variantName: "menu-open"
        },
        transition: {
            type: "DISSOLVE",
            duration: 0.2,
            easing: {
                type: "EASE_IN_OUT"
            }
        }
    },
    {
        id: "reaction-card-click",
        name: "Card Click",
        trigger: {
            type: "ON_CLICK",
            deviceType: "MOUSE",
            delay: 0,
            nodeId: "card-default"
        },
        action: {
            type: "SET_VARIANT",
            componentId: "card-component-set",
            variantName: "selected"
        },
        transition: {
            type: "DISSOLVE",
            duration: 0.15,
            easing: {
                type: "EASE_OUT"
            }
        }
    }
];

module.exports = {
    sampleFigmaNodes,
    sampleFigmaReactions,
    sampleMetadata,
    complexSampleNodes,
    complexSampleReactions
};

