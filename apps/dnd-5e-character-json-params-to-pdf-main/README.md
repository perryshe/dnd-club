# D&D 5E Character Sheet PDF Generator

This project generates a filled D&D 5E character sheet PDF based on JSON parameters passed via a URL. It is designed to simplify the process of creating and sharing character sheets for players and Dungeon Masters.

## Features

- Automatically fills out a D&D 5E character sheet PDF using JSON data.
- Supports URL parameters for easy sharing and customization.
- Outputs a ready-to-use PDF for printing or digital use.

## How It Works

1. The app takes a JSON object containing character details (e.g., stats, equipment, spells) as a URL parameter `player={}`.
2. The JSON data is parsed and used to populate a pre-designed fillable PDF template.
3. The filled PDF is generated and made available for download.

## Getting Started

### Prerequisites

- A modern web browser.
- Basic knowledge of JSON formatting.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dnd-5e-character-json-params-to-pdf.git
   ```
2. Open `index.html` in your browser.

### Usage

1. Prepare your character data in JSON format. Use the `exampleJson.js` file as a reference.
2. Pass the JSON data as a URL parameter to the app. For example:
   ```
   https://miketheanomaly.github.io/dnd-5e-character-json-params-to-pdf/?player=<your-json-data>
   ```
   Replace `<your-json-data>` with a URL-encoded JSON string.

3. The app will generate a filled PDF based on the provided data.

## LLM intergration
This is perfect to have a llm generate a charcter sheet from a photo or description. Here is a sample prompt.
###prompt
```
Generate a D\&D 5E character sheet in JSON format suitable for populating the following URL: `https://miketheanomaly.github.io/dnd-5e-character-json-params-to-pdf/?player=<your-json-data>`.

The JSON should include the following fields: `classLevel`, `background`, `playerName`, `characterName`, `alignment`, `xp`, `inspiration`, `str`, `profBonus`, `ac`, `initiative`, `speed`, `strMod`, `hpMax`, `stStrength`, `dex`, `hpCurrent`, `ideals`, `dexMod`, `hpTemp`, `bonds`, `con`, `hdTotal`, `deathSaveSuccess1`, `deathSaveSuccess2`, `deathSaveSuccess3`, `conMod`, `deathSaveFailure1`, `deathSaveFailure2`, `deathSaveFailure3`, `hd`, `flaws`, `int`, `stDexterity`, `stConstitution`, `stIntelligence`, `stWisdom`, `stCharisma`, `acrobatics`, `animalHandling`, `athletics`, `deception`, `history`, `insight`, `intimidation`, `stStrengthProf`, `stDexterityProf`, `stConstitutionProf`, `stIntelligenceProf`, `stWisdomProf`, `stCharismaProf`, `wpnName1`, `wpnAtkBonus1`, `wpnDamage1`, `intMod`, `wpnName2`, `wpnAtkBonus2`, `wpnDamage2`, `investigation`, `wis`, `wpnName3`, `wpnAtkBonus3`, `arcana`, `wpnDamage3`, `perception`, `wisMod`, `cha`, `nature`, `performance`, `medicine`, `religion`, `stealth`, `acrobaticsProf`, `animalHandlingProf`, `arcanaProf`, `athleticsProf`, `deceptionProf`, `historyProf`, `insightProf`, `intimidationProf`, `investigationProf`, `medicineProf`, `natureProf`, `perceptionProf`, `performanceProf`, `persuasionProf`, `religionProf`, `sleightOfHandProf`, `stealthProf`, `survivalProf`, `persuasion`, `sleightOfHand`, `chaMod`, `survival`, `attacksSpellcasting`, `passiveWisdom`, `cp`, `proficienciesLang`, `sp`, `ep`, `gp`, `pp`, `equipment`, `featuresTraits`, `characterName2`, `age`, `height`, `weight`, `eyes`, `skin`, `hair`, `factionSymbolImage`, `allies`, `factionName`, `backstory`, `featTraits2`, `treasure`, `characterImage`, `spellcastingClass`, `spellcastingAbility`, `spellSaveDC`, and `spellAtkBonus`.
```


### Warning

Please note that there is a limit to the length of the JSON object that can be passed as a URL parameter. This is due to browser-imposed URL length restrictions. If your JSON data is too large, consider simplifying the data or using an alternative method to pass the data to the app.

### Example

Here’s an example URL:
```
https://your-username.github.io/dnd-5e-character-json-params-to-pdf/?data=%7B%22characterName%22%3A%22Brother%20Theron%22%2C%22classLevel%22%3A%22Cleric%201%22%2C%22race%22%3A%22Human%22%2C%22alignment%22%3A%22Lawful%20Good%22%7D
```

### Customization

- Modify the `exampleJson.js` file to create your own character templates.
- Update the `5E_CharacterSheet_Fillable.pdf` file if you have a custom character sheet design.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the D&D community for inspiring this project.
- The fillable PDF template is based on the official D&D 5E character sheet.