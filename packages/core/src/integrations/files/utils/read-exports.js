const { resolve } = require('path')

const filepath = process.argv[process.argv.length - 1]

async function main() {
    const imported = await import(resolve(filepath))
    const keys = Object.keys(imported)
    // TODO: think about default
    const response = keys.filter(key => key !== "default")
    console.log(JSON.stringify(response))
}

main().catch(console.error)