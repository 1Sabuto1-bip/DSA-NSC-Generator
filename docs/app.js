const humanData = window.AVENTURIAN_NAME_DATA;
const speciesData = window.AVENTURIAN_SPECIES_DATA;

if (window.self !== window.top) document.body.classList.add("is-embedded");

const speciesSelect = document.querySelector("#species");
const variantSelect = document.querySelector("#variant");
const variantLabel = document.querySelector("#variant-label");
const genderInputs = [...document.querySelectorAll('input[name="gender"]')];
const genderFieldset = genderInputs[0].closest("fieldset");
const statusSelect = document.querySelector("#status");
const generatedName = document.querySelector("#generated-name");
const generatedMeta = document.querySelector("#generated-meta");
const constructionNote = document.querySelector("#construction-note");
const ruleTitle = document.querySelector("#rule-title");
const ruleDescription = document.querySelector("#rule-description");
const toast = document.querySelector(".toast");

const statusLabels = {
  simple: "einfache Namensform",
  respected: "ausführliche Namensform",
  upper: "herausgehobene Namensform"
};

const speciesRules = {
  human: {
    andergast: {
      simple: "Einfache Leute führen oft keinen festen Familiennamen. Stattdessen verweist der Name auf Herkunftsort, Hof oder Landschaft.",
      respected: "Freibauern und Stadtbewohner tragen meist einen Familiennamen.",
      upper: "Für die Oberschicht wird ein klangvoller Adelsname mit einem vorangestellten „von“ verwendet."
    },
    thorwal: {
      simple: "Der zweite Namensteil verweist auf Mutter oder Vater. Frauen erhalten die Endung -dottir, Männer die Endung -son.",
      respected: "Zum Elternnamen tritt die Zugehörigkeit zu einer Ottajasko, einer Dorf- oder Schiffsgemeinschaft.",
      upper: "Thorwal kennt keinen Adel nach mittelreichischem Vorbild. Eine herausgehobene Person trägt einen Ehrennamen und nennt ihre Ottajasko."
    }
  },
  achaz: "Achaznamen unterscheiden nicht nach Geschlecht. Ein zusätzlicher Herkunfts- oder Gelegenamen kann genannt werden, ist aber kein Familienname.",
  elf: "Elfen führen üblicherweise einen melodischen Vornamen und einen Zweitnamen, der Sippe, Wesen oder Taten beschreibt.",
  goblin: "Stammesgoblins führen meist einen Vornamen; Verdiente erhalten einen Beinamen und nennen außerhalb ihrer Sippe auch ihre Gemeinschaft. Städtische Goblins verwenden häufig einen Familiennamen.",
  grolm: "Ein dienender Grolm stellt Namen und Funktion seines Auftraggebers vor den eigenen Namen. Mächtige oder unabhängige Grolme führen oft nur den eigenen Namen.",
  ogre: "Oger führen meist nur einen Rufnamen. Viele Namen beschreiben eine auffällige Eigenschaft oder stammen aus dem Umfeld von Orks und Menschen.",
  ork: "Orks führen gewöhnlich einen Vornamen. Ehrennamen und die Nennung von Sippe oder Stamm müssen durch Taten verdient werden.",
  troll: "Trolle verbinden ihren Vornamen mit dem Namen eines Ahnen. Sippe, Stamm und Beiname können den Namen einer bedeutenden Person erweitern.",
  dwarf: "Zwerge verbinden ihren Vornamen traditionell mit einem Vater- oder Mutternamen. Tiefzwerge haben diese Tradition weitgehend verloren."
};

const selectedGender = () => genderInputs.find((input) => input.checked)?.value || "female";
const randomIndex = (length) => {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
};
const pick = (entries) => entries[randomIndex(entries.length)];
const possessive = (name) => /[sxzß]$/i.test(name) ? name : `${name}s`;

const buildHumanName = (variant, gender, status) => {
  const region = humanData[variant];
  const first = pick(region[gender]);
  if (variant === "andergast") {
    if (status === "simple") return { name: `${first} ${pick(region.origins)}`, construction: "Vorname + Herkunftsbezeichnung" };
    if (status === "upper") return { name: `${first} von ${pick(region.noble)}`, construction: "Vorname + Adelsname" };
    return { name: `${first} ${pick(region.family)}`, construction: "Vorname + Familienname" };
  }
  const parentGender = randomIndex(2) ? "female" : "male";
  const parent = possessive(pick(region[parentGender]));
  const familyName = `${parent}${gender === "female" ? "dottir" : "son"}`;
  if (status === "simple") return { name: `${first} ${familyName}`, construction: "Vorname + Elternname" };
  const community = `von der ${pick(region.ottajasko)}-Ottajasko`;
  if (status === "upper") {
    const epithet = pick(gender === "female" ? region.femaleEpithets : region.maleEpithets);
    return { name: `${first} „${epithet}“ ${familyName} ${community}`, construction: "Vorname + Ehrenname + Elternname + Ottajasko" };
  }
  return { name: `${first} ${familyName} ${community}`, construction: "Vorname + Elternname + Ottajasko" };
};

const buildSpeciesName = (species, variantKey, gender, status) => {
  if (species === "human") return buildHumanName(variantKey, gender, status);
  const variant = speciesData[species].variants[variantKey];
  const first = pick(variant.unisex || variant[gender] || variant.male || variant.female);

  if (species === "achaz") {
    if (status === "simple") return { name: first, construction: "geschlechtsunabhängiger Vorname" };
    return { name: `${first} aus ${pick(variant.origins)}`, construction: "Vorname + Herkunft oder Gelege" };
  }
  if (species === "elf") return { name: `${first} ${pick(variant.bynames)}`, construction: "Vorname + sprechender Zweitname" };
  if (species === "goblin") {
    if (variantKey === "urban") return { name: `${first} ${pick(variant.surnames)}`, construction: "Vorname + städtischer Familienname" };
    if (status === "simple") return { name: first, construction: "Vorname" };
    const byname = pick(variant.bynames);
    if (status === "upper") return { name: `${first} ${byname} von den ${pick(variant.clans)}`, construction: "Vorname + Beiname + Sippe" };
    return { name: `${first} ${byname}`, construction: "Vorname + verdienter Beiname" };
  }
  if (species === "grolm") {
    if (status === "upper") return { name: first, construction: "eigenständiger Name" };
    const patron = pick([...variant.female, ...variant.male]);
    const role = pick(variant.functions);
    if (status === "simple") return { name: `${possessive(patron)} ${role} ${first}`, construction: "Auftraggeber + Funktion + Vorname" };
    return { name: `${role} ${first}`, construction: "Funktion + Vorname" };
  }
  if (species === "ogre") return { name: first, construction: "Rufname" };
  if (species === "ork") {
    if (status === "simple") return { name: first, construction: "Vorname" };
    const byname = pick(variant.bynames);
    if (status === "upper") return { name: `${first} ${byname} Riak ${pick(variant.clans)}`, construction: "Vorname + Ehrenname + Sippe" };
    return { name: `${first} ${byname}`, construction: "Vorname + Kriegs- oder Ehrenname" };
  }
  if (species === "troll") {
    const parent = pick(variant.male);
    const ancestry = `${gender === "female" ? "Tochter" : "Sohn"} des ${parent}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Ahnenname" };
    if (status === "upper") return { name: `${first} ${ancestry}, ${pick(variant.bynames)} vom Stamm der ${pick(variant.tribes)}`, construction: "Vorname + Ahne + Beiname + Stamm" };
    return { name: `${first} ${ancestry} von den ${pick(variant.clans)}`, construction: "Vorname + Ahne + Sippe" };
  }
  if (species === "dwarf") {
    if (variantKey === "deep") return { name: first, construction: "Vorname ohne überlieferten Ahnenname" };
    const parent = pick(gender === "female" ? variant.female : variant.male);
    const ancestor = `${gender === "female" ? "groschna" : "groscho"} ${parent}`;
    if (status === "upper" && variant.bynames?.length) return { name: `${first} ${ancestor}, ${pick(variant.bynames)}`, construction: "Vorname + Ahnenname + Beiname" };
    return { name: `${first} ${ancestor}`, construction: "Vorname + Mutter- oder Vatername" };
  }
  return { name: first, construction: "Vorname" };
};

const populateVariants = () => {
  const species = speciesData[speciesSelect.value];
  variantLabel.textContent = species.variantLabel;
  variantSelect.replaceChildren(...Object.entries(species.variants).map(([value, variant]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = variant.label;
    return option;
  }));
  const isUnisex = speciesSelect.value === "achaz";
  genderFieldset.classList.toggle("is-disabled", isUnisex);
  genderInputs.forEach((input) => { input.disabled = isUnisex; });
};

const updateRule = () => {
  const speciesKey = speciesSelect.value;
  const variantKey = variantSelect.value;
  const species = speciesData[speciesKey];
  const variant = species.variants[variantKey];
  ruleTitle.textContent = `${species.label} · ${variant.label}`;
  ruleDescription.textContent = speciesKey === "human" ? speciesRules.human[variantKey][statusSelect.value] : speciesRules[speciesKey];
};

const fitGeneratedName = () => {
  generatedName.style.fontSize = "64px";
  const minSize = 22;
  const maxHeight = 132;
  let size = 64;
  while (size > minSize && (generatedName.scrollHeight > maxHeight || generatedName.scrollWidth > generatedName.clientWidth + 1)) {
    size -= 1;
    generatedName.style.fontSize = `${size}px`;
  }
  generatedName.classList.toggle("is-compact", size < 38);
};

const generate = () => {
  const speciesKey = speciesSelect.value;
  const species = speciesData[speciesKey];
  const variantKey = variantSelect.value;
  const variant = species.variants[variantKey];
  const gender = selectedGender();
  const status = statusSelect.value;
  const result = buildSpeciesName(speciesKey, variantKey, gender, status);
  generatedName.textContent = result.name;
  const genderLabel = speciesKey === "achaz" ? "geschlechtsunabhängig" : gender === "female" ? "weiblich" : "männlich";
  generatedMeta.textContent = `${species.label} · ${variant.label} · ${genderLabel} · ${statusLabels[status]}`;
  constructionNote.textContent = result.construction;
  updateRule();
  requestAnimationFrame(fitGeneratedName);
  generatedName.animate([{ opacity: .2, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
};

let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

document.querySelector("#generate").addEventListener("click", generate);
document.querySelector("#copy-name").addEventListener("click", async () => {
  const name = generatedName.textContent;
  if (!name || name === "–") return;
  try {
    await navigator.clipboard.writeText(name);
    showToast("Name kopiert.");
  } catch {
    window.prompt("Diesen Namen kopieren:", name);
  }
});

speciesSelect.addEventListener("change", () => { populateVariants(); generate(); });
variantSelect.addEventListener("change", generate);
genderInputs.forEach((input) => input.addEventListener("change", generate));
statusSelect.addEventListener("change", generate);
window.addEventListener("resize", fitGeneratedName);
if (window.ResizeObserver) new ResizeObserver(fitGeneratedName).observe(generatedName.parentElement);

populateVariants();
generate();
