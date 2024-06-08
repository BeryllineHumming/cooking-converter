const selectType = $(".select-type");
const modalEl = $(".modal");
const overlayEl = $(".overlay");
const typeTitleEl = $("#type-title");
const typeTitle1El = $("#type-title-1");
const typeTitle2El = $("#type-title-2");
const fromTitleEl = $("#from-title");
const toTitleEl = $("#to-title");
const flTypeLi = $(".fltype");
const sgTypeLi = $(".sgtype");
const oaTypeLi = $(".oatype");
const sticksLi = $('[data-food="sticks"]');
const notyeastEl = $('[data-food="not"]');
const yeastEl = $('[data-food="yeast"]');
const ingredientAmountEl = $("#ingredient-amount");

let whichIngredient, fromIng, toIng, convertFrom, convertTo, output;
let sub = 1;

// Modal Functionality

// Fix dropdown width; call function AFTER all show/hiding is done. Do not attempt to optimize since different dropdowns have different sizes.
const typeDropEl = $("#type-dropdown");
const typeDrop1El = $("#type-dropdown-1");
const typeDrop2El = $("#type-dropdown-2");
const fromDropEl = $("#from-dropdown");
const toDropEl = $("#to-dropdown");
const typeListEl = $("#type-list");
const typeList1El = $("#type-list-1");
const typeList2El = $("#type-list-2");
const fromListEl = $("#from-list");
const toListEl = $("#to-list");

const fixDropdown = function () {
  typeListEl.width(typeDropEl.width());
  typeList1El.width(typeDrop1El.width());
  typeList2El.width(typeDrop2El.width());
  fromListEl.width(fromDropEl.width());
  toListEl.width(toDropEl.width());
};

$(window).on("resize", fixDropdown);

const openConverter = function () {
  modalEl.show();
  overlayEl.show();
  sticksLi.hide();
  yeastEl.hide();
  notyeastEl.show();
};

const titles = [
  typeTitleEl,
  typeTitle1El,
  typeTitle2El,
  fromTitleEl,
  toTitleEl,
];
const selectReset = function () {
  for (i = 0; i < titles.length; i++) titles[i].html("Select");
};

const closeConverter = function () {
  modalEl.hide();
  overlayEl.hide();
  $(".output-container").html("");
  selectReset();
  ingredientAmountEl.val("");
  // reset variables
  sub = 1;
  fromIng = "";
  toIng = "";
};

$(".close-modal").on("click", closeConverter);
overlayEl.on("click", closeConverter);

$(document).on("keydown", function (e) {
  if (e.key === "Escape" && !modalEl.classList.contains("hidden")) {
    closeConverter();
  }
});

// Conversion Calculator

const pickIngredient = function (food) {
  whichIngredient = food;
  $("#ingredient").html(`Convert ${whichIngredient}`);
  openConverter();
};

$(".butter").on("click", function () {
  pickIngredient("butter");
  selectType.hide();
  sticksLi.show();
  fixDropdown();
});

$(".flour").on("click", function () {
  pickIngredient("flour");
  selectType.show();
  oaTypeLi.hide();
  sgTypeLi.hide();
  flTypeLi.show();
  fixDropdown();
});

$(".sugar").on("click", function () {
  pickIngredient("sugar");
  selectType.show();
  flTypeLi.hide();
  oaTypeLi.hide();
  sgTypeLi.show();
  fixDropdown();
});

$(".cocoa").on("click", function () {
  pickIngredient("cocoa powder");
  selectType.hide();
  fixDropdown();
});

$(".yeast").on("click", function () {
  pickIngredient("yeast");
  selectType.show();
  notyeastEl.hide();
  yeastEl.show();
  fixDropdown();
});

$(".oats").on("click", function () {
  pickIngredient("oats");
  selectType.show();
  sgTypeLi.hide();
  flTypeLi.hide();
  oaTypeLi.show();
  fixDropdown();
});

// For flour, sugar, and yeast, pick specific type
typeListEl.on("click", function (e) {
  whichIngredient = e.target.innerHTML;
  typeTitleEl.html(e.target.innerHTML);
});

typeList1El.on("click", function (e) {
  fromIng = e.target.innerHTML;
  typeTitle1El.html(e.target.innerHTML);
});

typeList2El.on("click", function (e) {
  toIng = e.target.innerHTML;
  typeTitle2El.html(e.target.innerHTML);
});

// Pick measurement types to convert to and from
fromListEl.on("click", function (e) {
  convertFrom = e.target.innerHTML;
  console.log(convertFrom);
  fromTitleEl.html(e.target.innerHTML);
});

toListEl.on("click", function (e) {
  convertTo = e.target.innerHTML;
  toTitleEl.html(e.target.innerHTML);
});

$(".btn-convert").on("click", function () {
  let inputAmount = ingredientAmountEl.val();
  // There seems to be a lot of disagreement about correct conversions when substituting yeast. The following calculations are based on advice from baking websites rather than calculations used by online converters; I am assuming, in this case, the bakers know better than the engineers.
  if (fromIng === "active dry yeast" && toIng === "instant yeast") {
    sub = 0.75;
  } else if (fromIng === "active dry yeast" && toIng === "fresh yeast") {
    sub = 2.25;
  } else if (fromIng === "instant yeast" && toIng === "active dry yeast") {
    sub = 1.333;
  } else if (fromIng === "instant yeast" && toIng === "fresh yeast") {
    sub = 3;
  } else if (fromIng === "fresh yeast" && toIng === "active dry yeast") {
    sub = 0.444;
  } else if (fromIng === "fresh yeast" && toIng === "instant yeast") {
    sub = 0.333;
  } else if (fromIng === toIng) {
    sub = 1;
  }

  console.log(
    inputAmount,
    convertFrom,
    convertTo,
    whichIngredient,
    fromIng,
    toIng
  );

  const convertCalc = num => {
    let answer = inputAmount * num * sub;
    output = answer % 1 === 0 ? answer : answer.toFixed(2);
  };

  // get fixed conversions out of the way
  if (convertFrom === "grams" && convertTo === "ounces") {
    convertCalc(0.0353);
  } else if (convertFrom === "grams" && convertTo === "pounds") {
    convertCalc(0.0022);
  } else if (convertFrom === "ounces" && convertTo === "grams") {
    convertCalc(28.35);
  } else if (
    (convertFrom === "ounces" && convertTo === "pounds") ||
    (whichIngredient === "cocoa powder" &&
      convertFrom === "tablespoons" &&
      convertTo === "cups")
  ) {
    convertCalc(0.0625);
  } else if (convertFrom === "pounds" && convertTo === "grams") {
    convertCalc(454);
  } else if (
    (convertFrom === "pounds" && convertTo === "ounces") ||
    (whichIngredient === "cocoa powder" &&
      convertFrom === "cups" &&
      convertTo === "tablespoons")
  ) {
    convertCalc(16);
  } else if (convertFrom === convertTo) {
    output = inputAmount;
    // convert butter
  } else if (whichIngredient === "butter") {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(227);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(7.96);
    } else if (
      (convertFrom === "cups" && convertTo === "sticks") ||
      (convertFrom === "ounces" && convertTo === "tablespoons") ||
      (convertFrom === "pounds" && convertTo === "cups")
    ) {
      convertCalc(2);
    } else if (convertFrom === "cups" && convertTo === "tablespoons") {
      convertCalc(15.93);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.0044);
    } else if (convertFrom === "grams" && convertTo === "sticks") {
      convertCalc(0.0088);
    } else if (convertFrom === "grams" && convertTo === "tablespoons") {
      convertCalc(0.0702);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.1256);
    } else if (convertFrom === "ounces" && convertTo === "sticks") {
      convertCalc(0.2525);
    } else if (convertFrom === "pounds" && convertTo === "sticks") {
      convertCalc(4);
    } else if (convertFrom === "pounds" && convertTo === "tablespoons") {
      convertCalc(31.85);
    } else if (convertFrom === "sticks" && convertTo === "grams") {
      convertCalc(113);
    } else if (convertFrom === "sticks" && convertTo === "ounces") {
      convertCalc(3.96);
    } else if (convertFrom === "sticks" && convertTo === "pounds") {
      convertCalc(0.25);
    } else if (
      (convertFrom === "sticks" && convertTo === "cups") ||
      (convertFrom === "tablespoons" && convertTo === "ounces") ||
      (convertFrom === "cups" && convertTo === "pounds")
    ) {
      convertCalc(0.5);
    } else if (convertFrom === "sticks" && convertTo === "tablespoons") {
      convertCalc(7.93);
    } else if (convertFrom === "tablespoons" && convertTo === "grams") {
      convertCalc(14.25);
    } else if (convertFrom === "tablespoons" && convertTo === "sticks") {
      convertCalc(0.1261);
    } else if (convertFrom === "tablespoons" && convertTo === "cups") {
      convertCalc(0.0628);
    } else if (convertFrom === "tablespoons" && convertTo === "pounds") {
      convertCalc(0.0314);
    }
    // convert ap flour or P sugar
  } else if (
    whichIngredient === "all-purpose flour" ||
    whichIngredient === "powdered sugar"
  ) {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(125);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(4.41);
    } else if (convertFrom === "cups" && convertTo === "pounds") {
      convertCalc(0.2755);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.008);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.2268);
    } else if (convertFrom === "pounds" && convertTo === "cups") {
      convertCalc(3.63);
    }
    // convert b flour
  } else if (whichIngredient === "bread flour") {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(127);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(4.48);
    } else if (convertFrom === "cups" && convertTo === "pounds") {
      convertCalc(0.2801);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.0079);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.2232);
    } else if (convertFrom === "pounds" && convertTo === "cups") {
      convertCalc(3.57);
    }
    // convert g or b sugar
  } else if (
    whichIngredient === "granulated sugar" ||
    whichIngredient === "brown sugar"
  ) {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(200);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(7);
    } else if (convertFrom === "cups" && convertTo === "pounds") {
      convertCalc(0.4405);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.005);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.1429);
    } else if (convertFrom === "pounds" && convertTo === "cups") {
      convertCalc(2.27);
    }
    // convert cocoa powder
  } else if (whichIngredient === "cocoa powder") {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(118);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(4.16);
    } else if (
      (convertFrom === "cups" && convertTo === "pounds") ||
      (convertFrom === "tablespoons" && convertTo === "ounces")
    ) {
      convertCalc(0.2604);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.0085);
    } else if (convertFrom === "grams" && convertTo === "tablespoons") {
      convertCalc(0.1355);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.2404);
    } else if (
      (convertFrom === "pounds" && convertTo === "cups") ||
      (convertFrom === "ounces" && convertTo === "tablespoons")
    ) {
      convertCalc(3.84);
    } else if (convertFrom === "pounds" && convertTo === "tablespoons") {
      convertCalc(61.5);
    } else if (convertFrom === "tablespoons" && convertTo === "grams") {
      convertCalc(7.38);
    } else if (convertFrom === "tablespoons" && convertTo === "pounds") {
      convertCalc(0.0162);
    }
    // convert and/or substitute yeast
  } else if (whichIngredient === "yeast") {
    if (convertFrom === "grams" && convertTo === "teaspoons") {
      convertCalc(0.3214);
    } else if (convertFrom === "grams" && convertTo === "tablespoons") {
      convertCalc(0.1071);
    } else if (
      (convertFrom === "ounces" && convertTo === "tablespoons") ||
      (convertFrom === "teaspoons" && convertTo === "tablespoons")
    ) {
      convertCalc(3);
    } else if (convertFrom === "ounces" && convertTo === "teaspoons") {
      convertCalc(9);
    } else if (convertFrom === "table" && convertTo === "grams") {
      convertCalc(9.3371);
    } else if (
      (convertFrom === "tablespoons" && convertTo === "ounce") ||
      (convertFrom === "tablespoons" && convertTo === "teaspoons")
    ) {
      convertCalc(0.3333);
    } else if (convertFrom === "teaspoons" && convertTo === "grams") {
      convertCalc(3.1114);
    } else if (convertFrom === "teaspoons" && convertTo === "ounces") {
      convertCalc(0.1111);
    }
    // convert rolled or quick oats
  } else if (whichIngredient === "rolled oats" || "quick oats") {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(90);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(3.17);
    } else if (convertFrom === "cups" && convertTo === "pounds") {
      convertCalc(0.2);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.0111);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.3155);
    } else if (convertFrom === "pounds" && convertTo === "cups") {
      convertCalc(5);
    }
    // convert steel-cut oats
  } else if (whichIngredient === "steel-cut oats") {
    if (convertFrom === "cups" && convertTo === "grams") {
      convertCalc(110);
    } else if (convertFrom === "cups" && convertTo === "ounces") {
      convertCalc(3.883);
    } else if (convertFrom === "cups" && convertTo === "pounds") {
      convertCalc(0.2427);
    } else if (convertFrom === "grams" && convertTo === "cups") {
      convertCalc(0.0091);
    } else if (convertFrom === "ounces" && convertTo === "cups") {
      convertCalc(0.2575);
    } else if (convertFrom === "pounds" && convertTo === "cups") {
      convertCalc(4.12);
    }
  }
  if (!inputAmount) {
    $(".output-container").html("Please enter amount.");
  } else {
    $(".output-container").html(
      `Converted amount is: ${output} ${
        output <= 1 ? convertTo.substr(0, convertTo.length - 1) : convertTo
      } of ${whichIngredient === "yeast" ? toIng : whichIngredient}`
    );
  }
});
