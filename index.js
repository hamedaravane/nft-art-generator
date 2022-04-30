const { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');

const template = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 3000 3000" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
        <!-- bg -->
        <!-- shadow_under -->
        <!-- tail -->
        <!-- body -->
        <!-- pattern -->
        <!-- ear -->
        <!-- neck -->
        <!-- face -->
        <!-- hair -->
        <!-- eye -->
        <!-- glass -->
        <!-- mouth -->
    </svg>
`

const takenNames = {};
const takendogs = {};
let idx = 5;

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function getRandomName() {
    const adjectives = 'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(' ');
    const names = 'eli bob naz sag pashmaloo fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(' ');

    const randAdj = randElement(adjectives);
    const randName = randElement(names);
    const name = `${randAdj}-${randName}`;


    if (takenNames[name] || !name) {
        return getRandomName();
    } else {
        takenNames[name] = name;
        return name;
    }
}

function getLayer(name, skip = 0.0) {
    const svg = readFileSync(`./layers/optimized/${name}.svg`, 'utf-8');
    const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
    const layer = svg.match(re)[0];
    return Math.random() > skip ? layer : '';
}

async function svgToPng(name) {
    const src = `./out/${name}.svg`;
    const dest = `./out/${name}.png`;

    const img = await sharp(src);
    const resized = await img.resize(3000);
    await resized.toFile(dest);
}


function createImage(idx) {

    const bg = randInt(2)
    const tail = randInt(3);
    const pattern = randInt(1);
    const ear = randInt(4);
    const neck = randInt(4);
    const face = randInt(3);
    const hair = randInt(4);
    const eye = randInt(8);
    const glass = randInt(3);
    const mouth = randInt(5);
    // 18,900 combinations

    const dog = [bg, tail, pattern, ear, neck, face, hair, eye, glass, mouth].join('');

    if (dog[takendogs]) {
        createImage();
    } else {
        const name = getRandomName()
        console.log(name)
        dog[takendogs] = dog;

        const final = template
            //.replace('<!-- bg -->', getLayer(`bg${bg}`))
            //.replace('<!-- shadow_under -->', getLayer('shadow_under0'))
            .replace('<!-- tail -->', getLayer(`tail${tail}`))
            .replace('<!-- body -->', getLayer('body0'))
            .replace('<!-- pattern -->', getLayer(`pattern${pattern}`))
            .replace('<!-- ear -->', getLayer(`ear${ear}`))
            .replace('<!-- neck -->', getLayer(`neck${neck}`))
            .replace('<!-- face -->', getLayer(`face${face}`))
            .replace('<!-- hair -->', getLayer(`hair${hair}`))
            .replace('<!-- eye -->', getLayer(`eye${eye}`))
            .replace('<!-- glass -->', getLayer(`glass${glass}`))
            .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))

        const meta = {
            name,
            description: `A drawing of ${name.split('-').join(' ')}`,
            image: `${idx}.png`,
            attributes: [
                {
                    beard: '',
                    rarity: 0.5
                }
            ]
        }

        writeFileSync(`./out/${idx}.json`, JSON.stringify(meta))
        writeFileSync(`./out/${idx}.svg`, final)
        svgToPng(idx)
    }


}


// Create dir if not exists
if (!existsSync('./out')) {
    mkdirSync('./out');
}

// Cleanup dir before each run
readdirSync('./out').forEach(f => rmSync(`./out/${f}`));


do {
    createImage(idx);
    idx--;
} while (idx >= 0);

//added to github