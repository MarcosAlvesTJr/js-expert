const { describe, it, beforeEach, before, afterEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const CarService = require('../../src/service/carService')
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
        sinon.stub(carService, carService.getRandomPositionFromArray.name).returns(carIdIndex)
        const result = carService.chooseRandomCar(carCategory)
        const expected = carCategory.carIds[carIdIndex]

        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })

    it('given a car category it should return an available car', async () => {
        const car = mocks.validCar
        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.carIds = [car.id]

        sinon.stub(carService.carRepository, carService.carRepository.find.name).resolves(car)
        sinon.spy(carService, carService.chooseRandomCar.name)

        const result = await carService.getAvailableCar(carCategory)
        const expected = car

        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id))
        expect(result).to.be.equal(expected)
    })
})