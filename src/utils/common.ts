/* eslint-disable no-bitwise */
export function dateToString(v: Date | number, f: string = 'yyyy-MM-dd hh:mm:ss') {
  let value = v;
  let fmt = f;
  if (!value) {
    return '';
  }
  value = new Date(value);
  const o: { [index: string]: number } = {
    'M+': value.getMonth() + 1, // 月份
    'd+': value.getDate(), // 日
    'h+': value.getHours(), // 小时
    'm+': value.getMinutes(), // 分
    's+': value.getSeconds(), // 秒
    'q+': Math.floor((value.getMonth() + 3) / 3), // 季度
    S: value.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${value.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k].toString() : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  });
  return fmt;
}

const Envs = ['dev', 'ontest', 'test', 'testone', 'testtwo', 'prod'] as const;
type EnvType = typeof Envs[number];
/**
 * 获取当前站点的所属env
 * @param fallback fallback
 * @returns env: dev, ontest, test, prod
 */
export function getEnv(fallback: EnvType = 'prod') {
  const validEnv: EnvType | undefined = Envs.find((env) => window.location.hostname.indexOf(`${env}.`) > -1);
  return validEnv || fallback;
}

/**
 * 移除对象上的null或undefined属性
 * @param ori 原始对象
 * @returns 返回新对象
 */
export function removeNullProperty<T extends object>(ori: T): T {
  if (typeof ori !== 'object') return ori;
  const obj = { ...ori };
  Object.keys(obj).forEach((k) => {
    // @ts-ignore
    const v = obj[k];
    if (v === null || v === undefined) {
      // @ts-ignore
      delete obj[k];
    }
  });
  return obj;
}

export function parseJson(str: string | null | undefined, errorValue: any = {}) {
  try {
    if (str) {
      return JSON.parse(str);
    }
    return errorValue;
  } catch (err) {
    return errorValue;
  }
}

export function hashCode(str: string) {
  let hash = 0;
  let i;
  let chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i += 1) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
