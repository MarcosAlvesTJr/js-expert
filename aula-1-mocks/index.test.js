const File = require("./src/file")
const { error } = require("./src/constants")
const { rejects, deepStrictEqual } = require("assert")
    ;
(async () => {
    {
        const filePath = "./mocks/emptyFileInvalid.csv"
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        await rejects(result, rejection)
    }
    {
        const filePath = "./mocks/invalidHeaders.csv"
        const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        await rejects(result, rejection)
    }
    {
        const filePath = "./mocks/fourItemsInvalid.csv"
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJson(filePath)

        await rejects(result, rejection)
    }
    {
        const filePath = "./mocks/threeItemsValid.csv"
        const result = await File.csvToJson(filePath)
        const expected = [
            {
                "id": 1,
                "name": "Marcos",
                "profession": "Js Dev",
                "birthDate": 2000
            },
            {
                "id": 2,
                "name": "Doc Ock",
                "profession": "Cientista",
                "birthDate": 1966
            },
            {
                "id": 3,
                "name": "Kraven",
                "profession": "Caçador",
                "birthDate": 1979
            }
        ]

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
    }
})()