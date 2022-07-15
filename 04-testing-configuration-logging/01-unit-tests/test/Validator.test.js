const Validator = require('../Validator');
const expect = require('chai').expect;

const validateName = (min, max, value) => {
  const validator = new Validator({
    name: {
      type: 'string',
      min,
      max,
    },
  });
  return validator.validate({name: value});
};

const validateAge = (min, max, value) => {
  const validator = new Validator({
    age: {
      type: 'number',
      min,
      max,
    },
  });
  return validator.validate({age: value});
};

const expectFieldError = (errors, fieldName) => (
  expect(errors[0]).to.have.property('field').and.to.be.equal(fieldName)
);


describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет соответствие типов', () => {
      it('выдаёт ошибку, если ожидается строка, передано число', () => {
        const errors = validateName(10, 20, 10);
        expect(errors).to.have.length(1);
        expectFieldError(errors, 'name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });
      it('выдаёт ошибку, если ожидается число, переданa строка', () => {
        const errors = validateAge(10, 20, '10');
        expect(errors).to.have.length(1);
        expectFieldError(errors, 'age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });
    });
    describe('валидатор проверяет строковые поля', () => {
      it('выдаёт ошибку, если значение меньше минимального', () => {
        const MIN = 10;
        const MAX = 20;
        const VALUE = '123';
        const errors = validateName(MIN, MAX, VALUE);

        expect(errors).to.have.length(1);
        expectFieldError(errors, 'name');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal(`too short, expect ${MIN}, got ${VALUE.length}`);
      });
      it('выдаёт ошибку, если значение больше максимального', () => {
        const MIN = 5;
        const MAX = 8;
        const VALUE = '123456789';
        const errors = validateName(MIN, MAX, VALUE);

        expect(errors).to.have.length(1);
        expectFieldError(errors, 'name');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal(`too long, expect ${MAX}, got ${VALUE.length}`);
      });
      it('не выдаёт ошибок, если передано значение из заданного диапазона', () => {
        const errors = validateName(5, 15, '123456');
        expect(errors).to.have.length(0);
      });
    });
    describe('валидатор проверяет числовые поля', () => {
      it('выдаёт ошибку, если значение меньше минимального', () => {
        const MIN = 10;
        const MAX = 20;
        const VALUE = 8;
        const errors = validateAge(MIN, MAX, VALUE);

        expect(errors).to.have.length(1);
        expectFieldError(errors, 'age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal(`too little, expect ${MIN}, got ${VALUE}`);
      });
      it('выдаёт ошибку, если значение больше максимального', () => {
        const MIN = 6;
        const MAX = 8;
        const VALUE = 10;
        const errors = validateAge(MIN, MAX, VALUE);

        expect(errors).to.have.length(1);
        expectFieldError(errors, 'age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal(`too big, expect ${MAX}, got ${VALUE}`);
      });
      it('не выдаёт ошибок, если передано значение из заданного диапазона', () => {
        const errors = validateAge(5, 15, 6);
        expect(errors).to.have.length(0);
      });
    });
    describe('валидатор проверяет несколько полей', () => {
      it('длина массива ошибок соответствует количеству полей', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
          age: {
            type: 'number',
            min: 5,
            max: 10,
          },
        });
        const errors = validator.validate({name: '1234', age: 11});
        expect(errors).to.have.length(2);
        expect(errors.find(({field}) => field === 'age')).not.undefined;
        expect(errors.find(({field}) => field === 'name')).not.undefined;
      });
      it('поля валидируются без ошибок при корректных значениях', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 5,
            max: 10,
          },
          age: {
            type: 'number',
            min: 5,
            max: 10,
          },
        });
        const errors = validator.validate({name: '123456', age: 8});
        expect(errors).to.have.length(0);
      });
    });
  });
});
