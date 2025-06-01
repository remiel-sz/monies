// Constants
const GRAINS_PER_OZT = 480;
const SILVER_TO_COPPER = 114; // 1 grain of silver = 114 grains of copper
const GOLD_TO_SILVER = 99.74; // 1 grain of gold = 99.74 grains of silver

// Metal prices in USD per troy ounce
const PRICES = {
    Gold: 3289.58,
    Silver: 32.98,
    Copper: 0.29
};

// DOM elements
const usdInput = document.getElementById('usdAmount');
const grainsInput = document.getElementById('copperGrains');
const goldResult = {
    amount: document.querySelector('#goldResult .metal-amount')
};
const silverResult = {
    amount: document.querySelector('#silverResult .metal-amount')
};
const copperResult = {
    amount: document.querySelector('#copperResult .metal-amount'),
    grains: document.querySelector('#copperResult .metal-grains')
};

// Format copper amount in ounces and grains
function formatCopperAmount(grains) {
    const ozt = Math.floor(grains / GRAINS_PER_OZT);
    const remainingGrains = Math.floor(grains % GRAINS_PER_OZT);
    
    if (ozt > 0) {
        if (remainingGrains > 0) {
            return `${ozt}ozt ${remainingGrains}gr`;
        }
        return `${ozt}ozt`;
    }
    return `${remainingGrains}gr`;
}

// Calculate metal amounts from copper grains
function calculateFromGrains(totalCopperGrains) {
    let remainingCopperGrains = Math.floor(totalCopperGrains);
    let silverOunces = 0;
    let goldOunces = 0;

    // Convert to silver ounces if we have enough copper grains
    if (remainingCopperGrains >= SILVER_TO_COPPER * GRAINS_PER_OZT) {
        // Calculate how many complete silver ounces we can make
        silverOunces = Math.floor(remainingCopperGrains / (SILVER_TO_COPPER * GRAINS_PER_OZT));
        // Calculate remaining copper grains
        remainingCopperGrains = remainingCopperGrains % (SILVER_TO_COPPER * GRAINS_PER_OZT);
    }

    // Convert to gold ounces if we have enough silver ounces
    if (silverOunces >= GOLD_TO_SILVER) {
        // Calculate how many complete gold ounces we can make
        goldOunces = Math.floor(silverOunces / GOLD_TO_SILVER);
        // Calculate remaining silver ounces
        silverOunces = Math.floor(silverOunces % GOLD_TO_SILVER);
    }

    return {
        goldOunces,
        silverOunces,
        copperGrains: remainingCopperGrains,
        totalCopperGrains: Math.floor(totalCopperGrains)
    };
}

// Calculate USD value from copper grains
function calculateUSDValue(copperGrains) {
    const copperOzt = copperGrains / GRAINS_PER_OZT;
    return copperOzt * PRICES.Copper;
}

// Calculate copper grains from USD
function calculateGrainsFromUSD(usdAmount) {
    const copperOzt = usdAmount / PRICES.Copper;
    return Math.floor(copperOzt * GRAINS_PER_OZT);
}

// Update display
function updateDisplay(metals) {
    // Update Gold
    goldResult.amount.textContent = metals.goldOunces > 0 ? `${metals.goldOunces}ozt` : '-';

    // Update Silver
    silverResult.amount.textContent = metals.silverOunces > 0 ? `${metals.silverOunces}ozt` : '-';

    // Update Copper
    copperResult.amount.textContent = formatCopperAmount(metals.copperGrains);
    copperResult.grains.textContent = `${metals.totalCopperGrains}gr Cu total`;
}

// Convert from USD input
function convertFromUSD() {
    const usdAmount = parseFloat(usdInput.value) || 0;
    if (usdAmount < 0) return;

    const totalCopperGrains = calculateGrainsFromUSD(usdAmount);
    grainsInput.value = totalCopperGrains;
    const metals = calculateFromGrains(totalCopperGrains);
    updateDisplay(metals);
}

// Convert from grains input
function convertFromGrains() {
    const grains = parseInt(grainsInput.value) || 0;
    if (grains < 0) return;

    const usdValue = calculateUSDValue(grains);
    usdInput.value = usdValue.toFixed(2);
    const metals = calculateFromGrains(grains);
    updateDisplay(metals);
}

// Event listeners
usdInput.addEventListener('input', () => {
    if (document.activeElement === usdInput) {
        convertFromUSD();
    }
});

grainsInput.addEventListener('input', () => {
    if (document.activeElement === grainsInput) {
        convertFromGrains();
    }
});

// Initial conversion
convertFromUSD(); 