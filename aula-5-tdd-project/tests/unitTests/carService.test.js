const { describe, it, beforeEach, before, afterEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const CarService = require('../../src/service/carService')
const Transaction = require('../../src/entities/transaction')
const { join } = require('path')

const carsDatabase = join(__dirname, '../../database', 'cars.json')

const mocks = {
    validCarCategory: require('../mocks/validCarCategory.json'),
    validCar: require('../mocks/validCar.json'),
    validCustomer: require('../mocks/validCustomer.json')
}

describe('CarService suit tests', () => {
    let carService = {}
    let sandbox = {}
    before(() => {
        carService = new CarService({ cars: carsDatabase })
    })

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]
        const result = carService.getRandomPositionFromArray(data)
        expect(result).to.be.lte(data.length).and.be.gte(0)
    })

    it('should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory
        const carIdIndex = 0
        sandbox.stub(carService, carService.getRandomPositionFromArray.name).returns(carIdIndex)
        const result = carService.chooseRandomCar(carCategory)
        const expected = carCategory.carIds[carIdIndex]

        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })

    it('given a car category it should return an available car', async () => {
        const car = mocks.validCar
        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.carIds = [car.id]

        sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car)
        sandbox.spy(carService, carService.chooseRandomCar.name)

        const result = await carService.getAvailableCar(carCategory)
        const expected = car

        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id))
        expect(result).to.be.equal(expected)
    })

    it('given a car category, customer and number of days it should calculate final amount in real', async () => {
        const customer = Object.create(mocks.validCustomer)
        customer.age = 50

        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.price = 37.6

        const numberOfDays = 5

        sandbox.stub(carService, 'taxesBasedOnAge').get(() => [{ from: 40, to: 50, then: 1.3 }])

        const expected = carService.currencyFormat.format(244.40)

        const result = carService.calculateFinalPrice(customer, carCategory, numberOfDays)

        expect(result).to.be.deep.equal(expected)
    })

    it('given a costumer and a car category it should return a transaction receipt', async () => {
        const car = mocks.validCar
        const carCategory = {
            ...mocks.validCarCategory,
            carIds: [car.id],
            price: 37.6
        }

        const customer = Object.create(mocks.validCustomer)
        customer.age = 20

        const numberOfDays = 5
        const dueDate = '10 de novembro de 2020'

        const today = new Date(2020, 10, 5)

        sandbox.useFakeTimers(today.getTime())
        sandbox.stub(carService.carRepository, carService.carRepository.find.name).returns(car)

        const expectedAmount = carService.currencyFormat.format(206.8)

        const result = await carService.rent(customer, numberOfDays, carCategory)
        const expected = new Transaction({ customer, car, dueDate, amount: expectedAmount })
        expect(result).to.be.deep.equal(expected)
    })
})
