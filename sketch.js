/**
 *  @author Cody
 *  @date 2022.7.12
 *
 *  https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/runesReforged.json
 *
 *  ☐ display each path name
 *  ☐ display keystones in each path
 *  ☐ display all runes in each path
 *  ☐ find images for each of the three items above
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let runes /* a json file of runes that we're going to use to replicate the
 runesReforged UI */


function preload() {
    font = loadFont('data/consola.ttf')
    runes = loadJSON('https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/runesReforged.json')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)
    console.log(runes)
}


function draw() {
    background(234, 34, 24)

    let pathNumber = 1

    for (let path of Object.values(runes)) {
        let keystones = []
        for (let keystone of path['slots'][0]['runes']) {
            keystones.push(' ' + keystone['name'])
        }

        text(path['key'] + ':' + keystones, 10, pathNumber*20)

        pathNumber++
    }

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

        /* semi-transparent background */
        fill(0, 0, 0, 10)
        rectMode(CORNERS)
        const TOP_PADDING = 3 /* extra padding on top of the 1st line */
        rect(
            0,
            height,
            width,
            DEBUG_Y_OFFSET - LINE_HEIGHT*this.debugMsgList.length - TOP_PADDING
        )

        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}