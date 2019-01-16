import {departments} from "./departments";
const faker:Faker.FakerStatic = require('faker/locale/ru');
import {HandleData} from '../../staffjs/src/shared/handle-data';
import {IPersonnel} from "../../staffjs/src/server/components/personnel/personnel.interface";
import {specialties} from "./specialties";

const depLength = departments.length;
const categories = Object.keys(specialties);
const catLength = categories.length;


function past(years?: number) {
  return faker.date.past(years).toISOString()
}

function booleanRareTrue(n = 6): boolean {
  return !faker.random.number({max:n})
}

function dateBetween(from: number, to: number) {
  let _from = faker.date.recent(100);
  _from.setFullYear(2018 - from);
  _from.toISOString();
  let _to = faker.date.future(0.01);
  _to.setFullYear(2018 - to);
  return faker.date.between(_from, _to).toISOString();
}

export class FakePersonnel {
  static create() {
    let ret = [];
    for (let i = 0; i < 1; i++) {
      ret.push(FakePersonnel.build())
    }
    return ret
  }

  static build() {
    const [surname, name] = faker.name.findName().split(' ');
    const worker: Partial<IPersonnel> = {
      number: faker.random.number({min:1000, max:9999}).toString(),
      surname,
      name,
      middleName: faker.lorem.word(),
      inn: faker.lorem.word(),
      insurance: faker.random.uuid(),
      educationName: faker.lorem.word(),
      workExpDate: faker.date.recent().toISOString(),
      profession: faker.name.jobType(),
      afterInstEduName: faker.lorem.word(),
      membershipGAN: faker.random.boolean(),
      membershipGANDate: past(5),
      membershipOAN: faker.random.boolean(),
      membershipOANDate: past(5),
      phone: faker.phone.phoneNumber(),
      medicalCert: faker.random.boolean(),
      psychoCert: faker.random.boolean(),
      convictionCert: faker.random.boolean(),
      disabilityDegree: faker.lorem.words(),
    };
    const passport: Partial<IPersonnel['passport']> = {
      birthDate: dateBetween(80, 20),
      birthPlace: `${faker.address.zipCode()}, ${faker.address.city()} ${faker.address.streetName()}  ${faker.address.streetAddress()} `,
      citizenship: faker.address.county(),
      maritalStatus: faker.lorem.word(),
      number: faker.random.uuid().slice(4, 15),
      passportIssued: dateBetween(20, 5),
      passportDate: dateBetween(30, 11),
      address: `${faker.address.zipCode()}, ${faker.address.city()} ${faker.address.streetName()}  ${faker.address.streetAddress()} `,
      passportRegDate: dateBetween(20, 11),
    };
    // https://rawgit.com/Marak/faker.js/master/examples/browser/index.html#date


    const institution: Partial<IPersonnel['institutions'][0]> = {
      name: faker.lorem.words(4),
      endDate: dateBetween(30, 11),
      qualification: faker.lorem.word(),
      specialty: faker.lorem.word(),
      docNumber: faker.random.number({min:100000, max:999999}).toString()
    };
    const scientificInst: Partial<IPersonnel['scientificInst'][0]> = {
      name: faker.lorem.words(4),
      fullInfo: faker.lorem.words(8),
      endDate: faker.random.number({min:1950, max:2017}).toString(),
      specialty: faker.lorem.words(2),
      academicDegree: faker.lorem.word(),
      scienceBranch: faker.lorem.words(2),
      dateAndNumber: faker.random.number({min:100000, max:999999}).toString(),
      dissertationCouncil: faker.lorem.words(4),
    };
    const academicRank: Partial<IPersonnel['academicRank'][0]> = {
      rank: faker.lorem.words(2),
      specialty: faker.lorem.words(2),
      docNumber: faker.random.number({min:100000, max:999999}).toString(),
      docDate: dateBetween(11, 3),
      appointingAuthority: faker.lorem.words(2),
    };

    const category = categories[faker.random.number({min:0, max:catLength-1})];
    const specialty: string = faker.random.arrayElement(specialties[category]);


    const workplaces: Partial<IPersonnel['workplaces'][0]> = {
      date: faker.lorem.words(2),
      department: departments[faker.random.number({min:0, max:depLength-1})],
      specialty,
      reason: faker.lorem.words(2),
      academicCouncilDate: dateBetween(11, 3),
      attractionTerms: faker.lorem.words(2),
      rate: faker.random.number({min:2, max:4}) * 0.25,
      duration: faker.random.number({min:30, max:40}),
      category,
      salaryCoef: faker.random.number({min:10, max:26}) / 10,
      dismissalDate: dateBetween(3, -1),
      dismissalGround: faker.lorem.words(2),
      lawArticle: faker.lorem.words(2),
      active: !booleanRareTrue(10000),
      contractNumber: faker.random.number({min:100000, max:999999}).toString(),
      contractDate: dateBetween(-1, -2),
      contractEndDate: dateBetween(-1, -2),
    };
    const rewards = this.getRewards();
    const workExp: Partial<IPersonnel['workExp']> = this.getWorkExp(null);
    console.log("*****",workplaces);
    return {
      worker, rewards,academicRank, passport, institution, scientificInst ,
      workplaces, workExp
    }
  }

  static getRewards() {
    const r = [];
    if(booleanRareTrue()) r.push('ОрденаМедали');
    if(booleanRareTrue()) r.push('ВедомствНагр');
    if(booleanRareTrue()) r.push('ПремииСПб');
    if(booleanRareTrue()) r.push('ЗвЗаслужИгоспремии');
    if(booleanRareTrue()) r.push('НагрГУАП');
    if(booleanRareTrue()) r.push('ПрочиеНагр');
    if(booleanRareTrue()) r.push('РегионНагр');
    if(booleanRareTrue()) r.push('ЗаслДеятН');
    if(booleanRareTrue()) r.push('ЗаслРабВШ');
    if(booleanRareTrue()) r.push('ЗаслРабСПО');
    if(booleanRareTrue()) r.push('ЗаслЮр');
    if(booleanRareTrue()) r.push('ПочРабВПО');
    if(booleanRareTrue()) r.push('РазвНИРстуд');
    if(booleanRareTrue()) r.push('ЗаслПрофГУАП');
    if(booleanRareTrue()) r.push('ПочРабСфМолП');
    if(booleanRareTrue()) r.push('ПочРабОбО');
    if(booleanRareTrue()) r.push('ПочРабНауки');

    return r.map((name) => ({name}))
  }

  static getWorkExp(personnelId): Partial<IPersonnel['workExp']> {
    return <Partial<IPersonnel['workExp']>>[{
      id: null,
      personnelId,
      typeId: 1,
      amountY: faker.random.number({min:1, max:10}),
      amountM: faker.random.number({min:1, max:10}),
      amountD: faker.random.number({min:1, max:30}),
    },{
      id: null,
      personnelId,
      typeId: 2,
      amountY: faker.random.number({min:1, max:10}),
      amountM: faker.random.number({min:1, max:10}),
      amountD: faker.random.number({min:1, max:30}),
    },{
      id: null,
      personnelId,
      typeId: 3,
      amountY: faker.random.number({min:0, max:10}),
      amountM: faker.random.number({min:0, max:10}),
      amountD: faker.random.number({min:0, max:30}),
    }]
  }
}

FakePersonnel.create();
