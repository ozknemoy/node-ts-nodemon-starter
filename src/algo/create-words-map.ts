import {__, getTextFromWText, isDev} from "./helpers";
import {IJsonXml, IParagraphOne, IParagraphTwo, IRunOne, isParagraphOneWithWRun} from "./models";


export interface IDummyAmount {
  from?: number
  to?: number
}

export function createWordsMap(jsonXml: IJsonXml, start: number, end: number, allWords: number): [IDummyAmount[][], number] {
  // первый проход просто считает _allWords
  allWords = allWords || /*for firstPass*/0;
  const firstPass = allWords === 0;

  const amountWordsNeededToAdd = /*52*/Math.floor((((end - start)/100 + 1) * allWords) - allWords);
  const allWordsMiddle = Math.floor(allWords/2);

  let allWordsCurrentIter = 0;
  let _allWordsP: number[][] = [];
  let middleFound = false;
  let _middleIndexP = 0;
  let _middleIndexRun = 0;
  let _middleIndexText = 0;
  jsonXml['w:document']['w:body'].forEach((bodyEl, iBodyEl) => {
    bodyEl['w:p'].forEach((p: IParagraphOne | IParagraphTwo, iP) => {
      let _allWordsRun: number[] = [];
      if (isParagraphOneWithWRun(p)) {
        p['w:r'].forEach((run: IRunOne, iRun) => {
          const wTextArr: string[] = __.splitWords(run['w:t']
            .map(wT => getTextFromWText(wT))
            .join(''));
          if(!firstPass) {
            _allWordsRun.push(wTextArr.length);
            // если перешагнули середину
            if(allWordsCurrentIter + wTextArr.length > allWordsMiddle && !middleFound) {
              middleFound = true;
              _middleIndexP = iP;
              _middleIndexRun = iRun;
              _middleIndexText = allWordsMiddle - allWordsCurrentIter;
              //console.log(`----------------> всего ${allWords}. адрес [${iP}][${iRun}][${_middleIndexText}] amountWordsNeededToAdd ${amountWordsNeededToAdd}`);
            }
          }

          allWordsCurrentIter += wTextArr.length;
        })
      }
      _allWordsP.push(_allWordsRun);
    });
  });
  if(firstPass) return createWordsMap(jsonXml, start, end, allWordsCurrentIter);
  return [_createWordsMap(_allWordsP, amountWordsNeededToAdd, _middleIndexP, _middleIndexRun, _middleIndexText), allWordsCurrentIter]
}

export function _createWordsMap(_allWordsP: number[][], amountWordsNeededToAdd: number, _middleIndexP: number, _middleIndexRun: number, _middleIndexText: number) {
  // получили
  //                <--M[47]-->                    [_middleIndexP][_middleIndexRun][_middleIndexText]
  // [ [ 1, 6, 1 ], [    48   , 1, 45, 1, 1, 1, 10, 1, 1 ] ] адрес [1][0][47]
  let allWordsNeededToAddToP: IDummyAmount[][] = _allWordsP.map(p => p.map(r => ({})));
  let amountWordsNeededToAddToPFlatten: number[] = __.flatten(_allWordsP);
  let amountWordsNeededToAddRemains = amountWordsNeededToAdd;
  let amountWordsNeededToAddRemainsLeft = Math.ceil(amountWordsNeededToAddRemains / 2);
  let amountWordsNeededToAddRemainsRight = amountWordsNeededToAddRemains - amountWordsNeededToAddRemainsLeft;

  // количество в среднем wT
  let middleAmount = _allWordsP[_middleIndexP][_middleIndexRun];

  allWordsNeededToAddToP[_middleIndexP][_middleIndexRun].from = Math.max(_middleIndexText - amountWordsNeededToAddRemainsLeft, 0);
  amountWordsNeededToAddRemainsLeft -= allWordsNeededToAddToP[_middleIndexP][_middleIndexRun].from > 0
    ? amountWordsNeededToAddRemainsLeft : _middleIndexText;
  allWordsNeededToAddToP[_middleIndexP][_middleIndexRun].to = Math.min(middleAmount, _middleIndexText + amountWordsNeededToAddRemainsRight);
  amountWordsNeededToAddRemainsRight -= allWordsNeededToAddToP[_middleIndexP][_middleIndexRun].to < middleAmount
    ? amountWordsNeededToAddRemainsRight : middleAmount - _middleIndexText;

  let _allWordsNeededToAddToPFlatten: IDummyAmount[] = __.flatten(allWordsNeededToAddToP);
  let _middleRunFlatten;
  //ищу середину
  for (let i = 0; i < _allWordsNeededToAddToPFlatten.length; i++) {
    if(_allWordsNeededToAddToPFlatten[i].from !== undefined) {
      _middleRunFlatten = i;
    }
  }

  // если ещё надо переходить дальше влево
  if(amountWordsNeededToAddRemainsLeft > 0) {
    for (let i = _middleRunFlatten - 1; i >= 0; i--) {
      const min = Math.min(amountWordsNeededToAddRemainsLeft, amountWordsNeededToAddToPFlatten[i]);
      amountWordsNeededToAddRemainsLeft -= min;
      if(amountWordsNeededToAddRemainsLeft <= 0) {
        Object.assign(_allWordsNeededToAddToPFlatten[i], {from: amountWordsNeededToAddToPFlatten[i] - min, to: amountWordsNeededToAddToPFlatten[i]})
        break;
      } else {
        Object.assign(_allWordsNeededToAddToPFlatten[i], {from: 0, to: amountWordsNeededToAddToPFlatten[i]});
      }
    }
  }
  // если ещё надо переходить дальше вправо
  if(amountWordsNeededToAddRemainsRight > 0) {
    for (let i = _middleRunFlatten + 1; i < _allWordsNeededToAddToPFlatten.length; i++) {
      const min = Math.min(amountWordsNeededToAddRemainsRight, amountWordsNeededToAddToPFlatten[i]);
      amountWordsNeededToAddRemainsRight -= min;
      if(amountWordsNeededToAddRemainsRight <= 0) {
        Object.assign(_allWordsNeededToAddToPFlatten[i], {from: 0, to: min});
        break;
      } else {
        Object.assign(_allWordsNeededToAddToPFlatten[i], {from: 0, to: amountWordsNeededToAddToPFlatten[i]})
      }
    }
  }

  return allWordsNeededToAddToP
}
