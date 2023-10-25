var AeroflexCalc = {
    init(settings = {}) {
        Object.assign(this.settings, this.default, settings);
    },

    constants: {
        DIFF: 3.6,
    },

    default: {
        region_coefficient: 1.0,
        material_conductivity: undefined,
        material_conductivity_delta: undefined,
        heat_coefficient: undefined,
        additional_loss: 1.0,
        density: undefined
    },

    settings: {},

    densityD: [15, 20, 25, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1400, Infinity],
    densityT: [20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600],

    resistanceD: [32, 40, 50, 100, 125, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 2000],
    resistanceT: [100, 300, 500],

    thermalResistance: [
        [// outdoor
            [// low emission
                [0.12, 0.09, 0.07],
                [0.10, 0.07, 0.05],
                [0.09, 0.06, 0.04],
                [0.07, 0.05, 0.04],
                [0.05, 0.04, 0.03],
                [0.05, 0.04, 0.03],
                [0.04, 0.03, 0.03],
                [0.03, 0.03, 0.02],
                [0.03, 0.02, 0.02],
                [0.03, 0.02, 0.02],
                [0.02, 0.02, 0.02],
                [0.02, 0.02, 0.016],
                [0.017, 0.015, 0.014],
                [0.015, 0.013, 0.012],
                [0.013, 0.012, 0.011],
                [0.012, 0.011, 0.010],
                [0.011, 0.010, 0.009],
                [0.006, 0.006, 0.005],
            ],
            [// high emission
                [0.12, 0.09, 0.07],
                [0.10, 0.07, 0.05],
                [0.09, 0.06, 0.04],
                [0.07, 0.05, 0.04],
                [0.05, 0.04, 0.03],
                [0.05, 0.04, 0.03],
                [0.04, 0.03, 0.03],
                [0.03, 0.03, 0.02],
                [0.03, 0.02, 0.02],
                [0.03, 0.02, 0.02],
                [0.02, 0.02, 0.02],
                [0.02, 0.02, 0.016],
                [0.017, 0.015, 0.014],
                [0.015, 0.013, 0.012],
                [0.013, 0.012, 0.011],
                [0.012, 0.011, 0.010],
                [0.011, 0.010, 0.009],
                [0.006, 0.006, 0.005],
            ]
        ],
        [// indoor
            [// low emission
                [0.50, 0.35, 0.30],
                [0.45, 0.30, 0.25],
                [0.40, 0.25, 0.20],
                [0.25, 0.19, 0.15],
                [0.21, 0.17, 0.13],
                [0.18, 0.15, 0.11],
                [0.16, 0.13, 0.10],
                [0.13, 0.10, 0.09],
                [0.11, 0.09, 0.08],
                [0.10, 0.08, 0.07],
                [0.09, 0.07, 0.06],
                [0.075, 0.065, 0.060],
                [0.062, 0.055, 0.050],
                [0.055, 0.051, 0.045],
                [0.048, 0.045, 0.042],
                [0.044, 0.041, 0.038],
                [0.040, 0.037, 0.034],
                [0.022, 0.020, 0.017],
            ],
            [// high emission
                [0.33, 0.22, 0.17],
                [0.29, 0.20, 0.15],
                [0.25, 0.17, 0.13],
                [0.15, 0.11, 0.10],
                [0.13, 0.10, 0.09],
                [0.12, 0.09, 0.08],
                [0.10, 0.08, 0.07],
                [0.09, 0.07, 0.06],
                [0.08, 0.07, 0.06],
                [0.07, 0.06, 0.05],
                [0.06, 0.05, 0.04],
                [0.050, 0.045, 0.040],
                [0.043, 0.038, 0.035],
                [0.038, 0.035, 0.032],
                [0.034, 0.031, 0.029],
                [0.031, 0.028, 0.026],
                [0.028, 0.026, 0.024],
                [0.015, 0.014, 0.013],
            ]
        ]
    ],

    conductivity: [
        // [0.0354, 0.00011], // EPDM
        [0.0351, 0.00011],
        [0.0337, 0.00010], // EPDM HT
        [0.0340, 0.00010]  // FIRO
        // [0.044, 0.00011], // EPDM
        // [0.0415, 0.00010], // EPDM HT
        // [0.0398, 0.00010]  // FIRO
    ],

    lossFactor: [
        [1.00, 1.00, 1.00, 1.00], // Europe
        [0.98, 0.98, 0.95, 0.94], // Ural
        [0.98, 0.98, 0.95, 0.94], // West Siberia
        [0.98, 0.98, 0.95, 0.94], // East Siberia
        [0.96, 0.96, 0.92, 0.90], // Far East
        [0.96, 0.96, 0.92, 0.90]  // Far North
    ],

    densityRate: [
        [// outdoor
            [// less or equal 5000
                [4, 10, 18, 28, 38, 49, 61, 74, 87, 102, 117, 133, 150],
                [5, 11, 21, 31, 42, 54, 67, 81, 96, 112, 128, 146, 164],
                [5, 12, 23, 34, 46, 59, 73, 88, 104, 120, 138, 157, 176],
                [6, 14, 26, 39, 52, 67, 82, 99, 116, 135, 154, 174, 196],
                [7, 16, 29, 43, 57, 73, 90, 107, 126, 146, 167, 189, 212],
                [8, 18, 33, 48, 65, 82, 100, 120, 141, 162, 185, 209, 234],
                [9, 20, 36, 52, 69, 88, 107, 128, 150, 172, 197, 222, 248],
                [10, 22, 39, 57, 76, 96, 116, 139, 162, 187, 212, 239, 267],
                [12, 25, 44, 63, 84, 113, 137, 162, 189, 216, 245, 276, 307],
                [13, 27, 48, 70, 92, 123, 149, 176, 205, 235, 266, 298, 332],
                [16, 34, 56, 83, 109, 146, 176, 207, 240, 274, 310, 347, 385],
                [19, 39, 67, 95, 124, 166, 199, 234, 270, 307, 346, 387, 429],
                [22, 44, 76, 106, 138, 184, 220, 258, 297, 338, 380, 424, 469],
                [27, 54, 92, 128, 164, 202, 241, 282, 324, 368, 413, 460, 508],
                [30, 60, 100, 139, 178, 219, 260, 304, 349, 395, 443, 493, 544],
                [33, 65, 109, 150, 192, 235, 280, 326, 373, 422, 473, 526, 580],
                [36, 71, 118, 162, 207, 253, 300, 349, 399, 451, 505, 561, 618],
                [42, 82, 135, 185, 235, 285, 338, 391, 447, 504, 563, 624, 686],
                [47, 91, 150, 204, 259, 314, 371, 429, 489, 551, 614, 679, 746],
                [53, 102, 166, 226, 286, 346, 407, 470, 535, 602, 670, 740, 812],
                [59, 112, 183, 248, 312, 377, 443, 511, 581, 652, 725, 800, 877],
                [64, 123, 199, 269, 339, 408, 479, 552, 626, 702, 780, 860, 941],
                [87, 165, 264, 355, 444, 532, 621, 712, 804, 898, 995, 1092, 1193],
                [19, 35, 54, 70, 85, 99, 112, 125, 141, 158, 174, 191, 205],
            ],
            [// greater 5000
                [4, 9, 17, 25, 35, 45, 56, 68, 81, 94, 109, 124, 140],
                [4, 10, 19, 28, 39, 50, 62, 75, 89, 103, 119, 135, 152],
                [5, 11, 20, 31, 42, 54, 67, 81, 95, 111, 128, 145, 163],
                [5, 12, 23, 35, 47, 60, 75, 90, 106, 123, 142, 161, 181],
                [6, 14, 26, 38, 51, 66, 81, 98, 115, 133, 153, 173, 195],
                [7, 16, 29, 43, 58, 74, 90, 108, 127, 147, 169, 191, 214],
                [8, 17, 31, 46, 62, 78, 96, 115, 135, 156, 179, 202, 226],
                [9, 19, 34, 50, 67, 85, 104, 124, 146, 168, 192, 217, 243],
                [10, 21, 38, 55, 74, 93, 114, 136, 159, 183, 208, 235, 263],
                [11, 23, 42, 61, 80, 101, 132, 156, 182, 209, 238, 267, 298],
                [14, 28, 50, 72, 95, 119, 154, 182, 212, 242, 274, 308, 343],
                [16, 33, 57, 82, 107, 133, 173, 204, 236, 270, 305, 342, 380],
                [18, 37, 64, 91, 118, 147, 191, 224, 259, 296, 333, 373, 414],
                [22, 45, 77, 108, 140, 173, 208, 244, 281, 320, 361, 403, 446],
                [25, 49, 84, 117, 152, 187, 223, 262, 301, 343, 385, 430, 476],
                [27, 54, 91, 127, 163, 200, 239, 280, 322, 365, 410, 457, 505],
                [30, 58, 98, 136, 175, 215, 256, 299, 343, 389, 436, 486, 537],
                [34, 67, 112, 154, 197, 241, 286, 333, 382, 432, 484, 537, 593],
                [38, 75, 124, 170, 217, 264, 313, 364, 416, 470, 526, 583, 642],
                [43, 83, 137, 188, 238, 290, 343, 397, 453, 511, 571, 633, 696],
                [47, 91, 150, 205, 259, 315, 372, 430, 490, 552, 616, 681, 749],
                [52, 100, 163, 222, 281, 340, 400, 463, 527, 592, 660, 729, 801],
                [70, 133, 215, 291, 364, 439, 514, 591, 670, 750, 833, 918, 1098],
                [15, 27, 41, 54, 66, 77, 89, 100, 110, 134, 153, 174, 192],
            ]
        ],
        [// indoor
            [// less or equal 5000
                [6, 6, 16, 25, 35, 46, 58, 71, 85, 99, 114, 130, 147],
                [7, 7, 18, 28, 40, 52, 65, 79, 93, 109, 126, 143, 161],
                [8, 8, 20, 31, 43, 56, 70, 85, 101, 118, 136, 154, 174],
                [10, 10, 23, 36, 49, 64, 80, 96, 114, 132, 152, 172, 194],
                [11, 11, 25, 40, 54, 70, 87, 105, 124, 144, 165, 187, 210],
                [13, 13, 29, 45, 62, 79, 98, 118, 139, 161, 184, 208, 233],
                [14, 14, 32, 49, 66, 85, 105, 126, 148, 171, 195, 221, 247],
                [16, 16, 35, 54, 73, 93, 115, 137, 161, 186, 212, 239, 267],
                [18, 18, 39, 60, 81, 103, 126, 151, 176, 203, 231, 261, 291],
                [21, 21, 44, 66, 89, 113, 138, 164, 192, 221, 251, 282, 315],
                [26, 26, 53, 80, 107, 134, 163, 194, 225, 258, 292, 328, 365],
                [30, 30, 62, 92, 122, 153, 185, 218, 253, 290, 327, 366, 407],
                [34, 34, 70, 103, 136, 170, 205, 241, 279, 319, 359, 402, 446],
                [38, 38, 77, 113, 149, 186, 224, 263, 304, 347, 391, 436, 483],
                [42, 42, 85, 123, 162, 201, 242, 284, 328, 373, 419, 467, 517],
                [46, 46, 92, 134, 175, 217, 260, 305, 351, 398, 448, 498, 551],
                [51, 51, 100, 144, 189, 233, 279, 327, 375, 426, 478, 532, 587],
                [58, 58, 114, 164, 214, 263, 314, 367, 420, 476, 533, 592, 652],
                [65, 65, 127, 182, 236, 290, 345, 402, 460, 520, 582, 645, 710],
                [73, 73, 141, 202, 261, 320, 379, 441, 504, 568, 635, 703, 772],
                [81, 81, 156, 221, 285, 349, 413, 479, 547, 616, 687, 760, 834],
                [89, 89, 170, 241, 309, 378, 447, 518, 590, 663, 739, 816, 896],
                [120, 120, 226, 318, 406, 492, 580, 668, 758, 850, 943, 1038, 1136],
                [26, 26, 46, 63, 78, 92, 105, 119, 132, 145, 158, 171, 190],
            ],
            [// greater 5000
                [6, 6, 14, 23, 33, 43, 54, 66, 79, 93, 107, 122, 138],
                [7, 7, 16, 26, 37, 48, 60, 73, 87, 102, 117, 134, 151],
                [8, 8, 18, 28, 40, 52, 65, 79, 94, 110, 126, 144, 162],
                [9, 9, 21, 32, 45, 59, 73, 89, 105, 122, 141, 160, 180],
                [10, 10, 23, 36, 50, 64, 80, 96, 114, 133, 152, 173, 194],
                [12, 12, 26, 41, 56, 72, 89, 107, 127, 147, 169, 191, 214],
                [13, 13, 28, 44, 60, 77, 95, 114, 135, 156, 179, 202, 227],
                [14, 14, 31, 48, 65, 84, 103, 124, 146, 169, 193, 218, 244],
                [16, 16, 35, 53, 72, 92, 113, 136, 159, 184, 210, 237, 265],
                [18, 18, 38, 58, 79, 100, 123, 147, 172, 199, 226, 255, 285],
                [22, 22, 46, 70, 93, 118, 144, 172, 200, 230, 262, 294, 328],
                [26, 26, 53, 79, 106, 134, 162, 193, 224, 257, 291, 327, 364],
                [29, 29, 60, 88, 118, 148, 179, 212, 246, 281, 318, 357, 396],
                [33, 33, 66, 97, 129, 161, 195, 230, 267, 305, 344, 385, 428],
                [36, 36, 72, 106, 139, 174, 210, 247, 286, 326, 368, 411, 456],
                [39, 39, 78, 114, 150, 187, 225, 264, 305, 348, 392, 437, 484],
                [43, 43, 84, 123, 161, 200, 241, 282, 326, 370, 417, 465, 514],
                [49, 49, 96, 139, 181, 225, 269, 315, 363, 412, 462, 515, 569],
                [55, 55, 107, 153, 200, 247, 295, 344, 395, 448, 502, 558, 616],
                [61, 61, 118, 169, 220, 270, 322, 376, 431, 487, 546, 606, 668],
                [67, 67, 130, 185, 239, 294, 350, 407, 466, 527, 589, 653, 718],
                [74, 74, 141, 201, 259, 318, 377, 438, 501, 565, 631, 699, 768],
                [99, 99, 187, 263, 337, 411, 485, 561, 638, 716, 797, 880, 964],
                [23, 23, 41, 56, 69, 82, 94, 106, 118, 130, 141, 153, 165],
            ]
        ],
    ],

    thermalMaterialLoss: [
        [// not flat
            [// horizontal
                // outdoor
                [26, 26],
                // indoor
                [7, 10],
            ],
            [// vertical
                // outdoor
                [35, 35],
                // indoor
                [8, 12],
            ]
        ],
        [// flat
            [// horizontal
                // outdoor
                [35, 35],
                // indoor
                [8, 12],
            ],
            [// vertical
                // outdoor
                [35, 35],
                // indoor
                [8, 12],
            ]
        ]
    ],

    additionalLoss: [
        [// indoor
            1.2,  // less 150 mm, movable support
            1.15, // greater or equal 150 mm, movable support
            1.05, // steel, suspension support
            1.7,  // nonmetal
        ],
        [// outdoor
            1.15,
            1.15,
            1.15,
            1.15,
        ]
    ],

    /**
     * Returns indoor constants array dimension
     *
     * @param {boolean|number} isIndoor
     *
     * @returns {number}
     */
    getIndoorDim: function(isIndoor) {
        return typeof isIndoor !== 'boolean' && isIndoor !== 0 && isIndoor !== 1
            ? 2
            : isIndoor
                ? 1
                : 0;
    },

    getLowerBound: function (value, arr) {
        let i = 0;

        for (; i < arr.length; i++) {
            if (arr[i] >= value) {
                break;
            }
        }

        return Math.max(0, i - 1);
    },

    getHigherBound: function (value, arr) {
        let i = 0;

        for (; i < arr.length; i++) {
            if (arr[i] >= value) {
                break;
            }
        }

        return Math.min(arr.length - 1, i);
    },

    getRatio: function (value, low, high) {
        return high !== low ? (value - low) / (high - low) : 0;
    },

    getLinearInterpolation: function (ratio, low, high) {
        return low + ratio * (high - low);
    },

    /**
     * Returns conductivity coefficient for specific material
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     *
     * @return {number}
     */
    getThermalConductivityCoefficient: function(material) {
        return Number.isFinite(this.settings.material_conductivity)
            ? this.settings.material_conductivity
            : this.conductivity[material][0];
    },


    /**
     * Returns delta for conductivity coefficient for specific material
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     *
     * @return {number}
     */
    getThermalConductivityDelta: function(material) {
        return Number.isFinite(this.settings.material_conductivity_delta)
            ? this.settings.material_conductivity_delta
            : this.conductivity[material][1];
    },

    /**
     * Returns conductivity coefficient for specific material with thermal correction
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     * @param {number} temperatureIn - internal pipe temperature
     * @param {number} temperatureOut - air temperature
     *
     * @return {number}
     */
    getThermalConductivityByMaterial: function (material, temperatureIn, temperatureOut) {
        return this.getThermalConductivityCoefficient(material) + this.getThermalConductivityDelta(material) * (temperatureIn + temperatureOut) / 2.0;
    },

    /**
     * Returns additional loss factor
     *
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     * @param {number} indoor - piping method (0 - outdoor, 1 - indoor/tunnel, 2 - impassable channel, 3 - channelless)
     *
     * @return {number}
     */
    getRegionKoef: function (region, indoor) {
        return Number.isFinite(this.settings.region_coefficient)
            ? this.settings.region_coefficient
            : this.lossFactor[region][indoor];
    },

    /**
     * Returns type of method for calculation isolation depth by heat flow density
     *
     * @param {boolean} isFlat - is flat surface
     * @param {number} diameter - pipe diameter (in mm)
     *
     * @return {boolean}
     */
    isSurfaced: function (isFlat, diameter) {
        return isFlat || diameter >= 2000;
    },

    /**
     * Returns thermal resistance to heat transfer coefficient
     *
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {boolean}
     */
    getThermalLossCoefficient: function(isFlat, isVertical, isIndoor, emission) {
        const
            flatDim = isFlat ? 1 : 0,
            verticalDim = isVertical ? 1 : 0,
            indoorDim = this.getIndoorDim(isIndoor);

        return Number.isFinite(this.settings.heat_coefficient)
            ? this.settings.heat_coefficient
            : this.thermalMaterialLoss[flatDim][verticalDim][indoorDim][emission];
    },

    /**
     * Returns linear coefficient of thermal resistance to external heat transfer
     *
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number}
     */
    getThermalResistanceByMaterial: function (isFlat, isVertical, isIndoor, emission) {
        return 1.0 / this.getThermalLossCoefficient(isFlat, isVertical, isIndoor, emission);
    },

    /**
     * Returns linear coefficient of thermal resistance to external heat transfer
     *
     * @param {number} diameter - pipe diameter (in mm)
     * @param {number} temperatureIn - inner temperature
     * @param {number|boolean} isIndoor - is pipes are indoor
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number}
     */
    getThermalResistance: function (diameter, temperatureIn, isIndoor, emission) {
        const
            indoorDim = this.getIndoorDim(isIndoor),
            tl = this.getLowerBound(temperatureIn, this.resistanceT),
            th = this.getHigherBound(temperatureIn, this.resistanceT),
            dl = this.getLowerBound(diameter, this.resistanceD),
            dh = this.getHigherBound(diameter, this.resistanceD),
            tRatio = this.getRatio(temperatureIn, this.resistanceT[tl], this.resistanceT[th]),
            dRatio = this.getRatio(diameter, this.resistanceD[dl], this.resistanceD[dh]),
            dInterpolationLow = this.getLinearInterpolation(dRatio, this.thermalResistance[indoorDim][emission][dl][tl], this.thermalResistance[indoorDim][emission][dh][tl]),
            dInterpolationHigh = this.getLinearInterpolation(dRatio, this.thermalResistance[indoorDim][emission][dl][th], this.thermalResistance[indoorDim][emission][dh][th]);

        return this.getLinearInterpolation(tRatio, dInterpolationLow, dInterpolationHigh);
    },

    /**
     * Returns additional thermal loss factor through pillars
     *
     * @param {boolean} isTunnel - is pipes are in tunnel
     * @param {number} diameter - pipe diameter (in mm)
     * @param {boolean} isSteel - is pipe steel
     * @param {boolean} isMovable - is pipe on movable (not suspension) support
     *
     * @return {number}
     */
    getAdditionalLossFactor: function (diameter, isTunnel = false, isSteel = true, isMovable = true) {
        if (Number.isFinite(this.settings.additional_loss)) {
            return this.settings.additional_loss;
        }

        return isTunnel
            ? this.additionalLoss[1][0]
            : !isSteel
                ? this.additionalLoss[0][3]
                : !isMovable
                    ? this.additionalLoss[0][2]
                    : diameter < 150
                        ? this.additionalLoss[0][0]
                        : this.additionalLoss[0][1];
    },

    /**
     * Returns depth of insulation from standardized flat surface heat flow density
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     * @param {number} diameter - pipe diameter (in mm)
     * @param {number} temperatureIn - inner temperature
     * @param {number} temperatureOut - air temperature
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     * @param {number} hours - number of working hours
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number} in mm
     */
    getFlatHeatFlowDepth: function (material, diameter, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission) {
        const
            loss = this.getAdditionalLossFactor(diameter),
            thermalConductivity = this.getThermalConductivityByMaterial(material, temperatureIn, temperatureOut),
            thermalResistance = !this.isSurfaced(isFlat, diameter)
                ? this.getThermalResistance(diameter, temperatureIn, isIndoor, emission)
                : this.getThermalResistanceByMaterial(isFlat, isVertical, isIndoor, emission);

        let density = this.getSurfaceHeatFlowDensity(diameter, temperatureIn, isIndoor, hours, isFlat, region);

        if (Number.isFinite(this.settings.density)) {
            density = this.settings.density;
        }

        return Math.max(0, thermalConductivity * (loss * (temperatureIn - temperatureOut) / density - thermalResistance)) * 1000;
    },

    /**
     * Returns surface heat flow by isolation depth
     *
     * @param {number} depth - insulation depth
     * @param {number} tCond - thermal conductivity
     * @param {number} tRes - thermal resistance of isolation
     * @param {number} diameter - pipe diameter (in metres)
     * @param {number} temperatureIn - inner temperature
     * @param {number} temperatureOut - air temperature
     *
     * @return {number}
     */
    getSurfaceHeatFlow: function (depth, tCond, tRes, diameter, temperatureIn, temperatureOut) {
        return Math.PI * (temperatureIn - temperatureOut) / (1.0 / (tRes * (diameter + 2 * depth)) + 1.0 / (2 * tCond) * Math.log((diameter + 2 * depth) / diameter));
    },

    /**
     * Returns depth of insulation from standardized curvilinear surface heat flow density using sequential approximation
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     * @param {number} diameter - pipe diameter (in mm)
     * @param {number} temperatureIn - inner temperature
     * @param {number} temperatureOut - air temperature
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     * @param {number} hours - number of working hours
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number}
     */
    getCurvilinearHeatFlowDepthByApproximation: function (material, diameter, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission) {
        const
            eps = 1e-4,
            density = this.getSurfaceHeatFlowDensity(diameter, temperatureIn, isIndoor, hours, isFlat, region),
            tCond = this.getThermalConductivityByMaterial(material, temperatureIn, temperatureOut),
            tRes = 1.0 / this.getThermalResistanceByMaterial(isFlat, isVertical, isIndoor, emission),
            loss = this.getAdditionalLossFactor(diameter),
            d = diameter / 1000; // in metres

        let qi = 0;

        while (loss * this.getSurfaceHeatFlow(qi, tCond, tRes, d, temperatureIn, temperatureOut) - density > 0 && qi < 1) {
            qi += eps;
        }

        return qi * 1000;
    },

    /**
     * Returns integral exposure from pipe surface
     *
     * @param value
     *
     * @return {number}
     */
    getExposure: function (value) {
        return Math.pow(Math.E, 2 * Math.PI * value);
    },

    /**
     * Returns integral insulation depth
     *
     * @param diameter - inner pipe diameter
     * @param B - integral coefficient
     *
     * @return {number}
     */
    getInsulationDepth: function (diameter, B) {
        return diameter * (B - 1) / 2;
    },

    /**
     * Returns depth of insulation from standardized curvilinear surface heat flow density
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     * @param {number} diameterIn - inner pipe diameter
     * @param {number} diameterOut - outer pipe diameter
     * @param {number} temperatureIn - inner temperature
     * @param {number} temperatureOut - air temperature
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     * @param {number} hours - number of working hours
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number}
     */
    getCurvilinearHeatFlowDepth: function (material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission) {
        const
            flatDepth = this.getFlatHeatFlowDepth(material, diameterIn, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission),
            B = this.getExposure(flatDepth / 1000.0);

        return this.getInsulationDepth(diameterOut, B);
    },

    /**
     * Returns normal surface heat flow density
     *
     * @param {number} diameter - pipe diameter
     * @param {number} temperatureIn - inner temperature
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {number} hours - number of working hours
     * @param {boolean} isFlat - is flat surface
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     *
     * @return {number}
     */
    getSurfaceHeatFlowDensity: function (diameter, temperatureIn, isIndoor, hours, isFlat, region) {
        const
            indoorDim = this.getIndoorDim(isIndoor),
            hoursDim = hours > 5000 ? 1 : 0,
            tl = this.getLowerBound(temperatureIn, this.densityT),
            th = this.getHigherBound(temperatureIn, this.densityT),
            dl = this.getLowerBound(diameter, this.densityD),
            dh = this.getHigherBound(diameter, this.densityD),
            tRatio = this.getRatio(temperatureIn, this.densityT[tl], this.densityT[th]),
            dRatio = this.getRatio(diameter, this.densityD[dl], this.densityD[dh]);

        // more 1400 or flat surface
        if (isFlat || diameter > 1400) {
            return this.getRegionKoef(region, indoorDim) * this.getLinearInterpolation(tRatio, this.densityRate[indoorDim][hoursDim][this.densityD.length - 1][tl], this.densityRate[indoorDim][hoursDim][this.densityD.length - 1][th]);
        }

        const
            dInterpolationLow = this.getLinearInterpolation(dRatio, this.densityRate[indoorDim][hoursDim][dl][tl], this.densityRate[indoorDim][hoursDim][dh][tl]),
            dInterpolationHigh = this.getLinearInterpolation(dRatio, this.densityRate[indoorDim][hoursDim][dl][th], this.densityRate[indoorDim][hoursDim][dh][th]);

        return this.getRegionKoef(region, indoorDim) * this.getLinearInterpolation(tRatio, dInterpolationLow, dInterpolationHigh);
    },

    /**
     * Returns depth of insulation from standardized surface heat flow density
     *
     * @param {number} material - insulation material (0 - EPDM, 1 - EPDM HT, 2 - FIRO)
     * @param {number} diameterIn - inner pipe diameter
     * @param {number} diameterOut - outer pipe diameter
     * @param {number} temperatureIn - inner temperature
     * @param {number} temperatureOut - air temperature
     * @param {boolean} isIndoor - is pipes are indoor
     * @param {boolean} isFlat - is flat surface
     * @param {boolean} isVertical - is pipes have vertical position
     * @param {number} region - equipment installation location (0 - Europe, 1 - Ural, 2 - West Siberia, 3 - East Siberia, 4 - Far East, 5 - Far North or similar)
     * @param {number} hours - number of working hours
     * @param {number} emission - coefficient of emission (0 - small emission, 1 - high emission)
     *
     * @return {number}
     */
    getSurfaceHeatFlowDepth: function (material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission) {
        return this.isSurfaced(isFlat, diameterIn)
            ? this.getFlatHeatFlowDepth(material, diameterIn, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission)
            : this.getCurvilinearHeatFlowDepth(material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, hours, emission);
    },

    /**
     * Returns thermal resistance of insulation from given thermal difference of transfer fluid
     *
     * @param {number} length
     * @param {number} diameterIn
     * @param {number} diameterOut
     * @param {boolean|number} isIndoor
     * @param {number} consumption
     * @param {number} capacity
     * @param {number} temperatureBefore
     * @param {number} temperatureAfter
     * @param {number} temperatureOut
     * @param {boolean} isSteel
     * @param {boolean} isMovable
     * @param {number} emission
     *
     * @returns {number}
     */
    getThermalInsulationResistance: function (length, diameterIn, diameterOut, isIndoor, consumption, capacity, temperatureBefore, temperatureAfter, temperatureOut, isSteel, isMovable, emission) {
        const
            variant = (temperatureBefore - temperatureOut) / (temperatureAfter - temperatureOut),
            lossFactor = this.getAdditionalLossFactor(diameterOut, false, isSteel, isMovable);

        let koefficient = (variant >= 2)
            ? 1.0 / Math.log(variant)
            : ((temperatureBefore + temperatureAfter) / 2.0 - temperatureOut) / (temperatureBefore - temperatureAfter);

        return this.constants.DIFF * koefficient * lossFactor * length / consumption / capacity;
    },

    /**
     * Returns depth of insulation from given thermal difference of transfer fluid
     *
     * @param {number} length
     * @param {number} diameterIn
     * @param {number} diameterOut
     * @param {boolean|number} isIndoor
     * @param {number} consumption
     * @param {number} capacity
     * @param {number} temperatureBefore
     * @param {number} temperatureAfter
     * @param {number} temperatureOut
     * @param {number} isolation
     * @param {boolean} isSteel
     * @param {boolean} isMovable
     * @param {number} emission
     *
     * @returns {number}
     */
    getThermalDifferenceFlowDepth: function (length, diameterIn, diameterOut, isIndoor, consumption, capacity, temperatureBefore, temperatureAfter, temperatureOut, isolation, isSteel, isMovable, emission) {
        const
            indoorDim = this.getIndoorDim(isIndoor),
            indoorWithoutTunnel = indoorDim > 1 ? 1 : indoorDim,
            thermalInsulationResistance = this.getThermalInsulationResistance(length, diameterIn, diameterOut, isIndoor, consumption, capacity, temperatureBefore, temperatureAfter, temperatureOut, isSteel, isMovable, emission),
            thermalPipeResistance = this.getThermalResistance(diameterIn * 1000, temperatureBefore, indoorWithoutTunnel, emission),
            thermalConductivity = this.getThermalConductivityByMaterial(isolation, temperatureBefore, temperatureOut),
            B = this.getExposure(thermalConductivity * (thermalInsulationResistance - thermalPipeResistance));

        return this.getInsulationDepth(diameterOut, B);
    },

    getInsulationDepthWithoutPipesSettings: function(surfaceInsulationTemperature, isFlat, isVertical, isIndoor, emission, material, temperatureIn, temperatureOut ) {
      const topArg = this.getThermalConductivityCoefficient(material) * (temperatureIn - surfaceInsulationTemperature)
      const bottomArg = this.getThermalLossCoefficient(isFlat, isVertical, isIndoor, emission) * (surfaceInsulationTemperature - temperatureOut)

      return 1000 * (topArg / bottomArg)
    },


    getInsulationDepthWithPipesSettings: function (material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, emission, surfaceInsulationTemperature) {
      let k = 0.0001

      while(true) {
        const RnL = 1 / (3.14 * ((diameterOut / 1000) + 2 * k) * this.getThermalLossCoefficient(isFlat, isVertical, isIndoor, emission))

        const LnB = 2 * 3.14 * this.getThermalConductivityCoefficient(material) * RnL * ((temperatureIn - surfaceInsulationTemperature) / (surfaceInsulationTemperature - temperatureOut))
  
        const B = Math.pow(2.71828, LnB)

        const insulationDepth = (diameterOut / 1000) * (B - 1) / 2
        
        if (k > insulationDepth) {
          return insulationDepth * 1000
        }
        
        k += 0.00001
      }
  
      
  },


    getInsulationDepthWithSurfaceTemperature: function (material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, emission, surfaceInsulationTemperature) {
      return isFlat 
        ? this.getInsulationDepthWithoutPipesSettings(surfaceInsulationTemperature, isFlat, isVertical, isIndoor, emission, material, temperatureIn, temperatureOut) 
        : this.getInsulationDepthWithPipesSettings(material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, emission, surfaceInsulationTemperature)
    }
};
