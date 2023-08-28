import { NaverError } from 'errors/naver.error';

export const naverAgeDicision = (ages: string) => {
  let ageExplanation: string;

  if (ages === '1') {
    ageExplanation = '0~12세';
    return ageExplanation;
  }

  if (ages === '2') {
    ageExplanation = '13~18세';
    return ageExplanation;
  }

  if (ages === '3') {
    ageExplanation = '19~24세';
    return ageExplanation;
  }

  if (ages === '4') {
    ageExplanation = '25~29세';
    return ageExplanation;
  }

  if (ages === '5') {
    ageExplanation = '30~34세';
    return ageExplanation;
  }

  if (ages === '6') {
    ageExplanation = '35~39세';
    return ageExplanation;
  }

  if (ages === '7') {
    ageExplanation = '40~44세';
    return ageExplanation;
  }

  if (ages === '8') {
    ageExplanation = '45~49세';
    return ageExplanation;
  }

  if (ages === '9') {
    ageExplanation = '50~54세';
    return ageExplanation;
  }

  if (ages === '10') {
    ageExplanation = '55~59세';
    return ageExplanation;
  }

  if (ages === '11') {
    ageExplanation = '60세 이상';
    return ageExplanation;
  }

  if (ages === '') {
    ageExplanation = '';
    return ageExplanation;
  }

  throw new NaverError('Naver Data Lab Search', 'Age Not Invalid');
};
