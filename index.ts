/* 
  В качестве оригинала даётся объект, представляющий собой дерево заранее неизвестной глубины
  Листья дерева ― строки с {placeholder}'ами

  Результатом должен быть объект такой же формы, как и оригинал
  Листья дерева ― format-функции, заменяющие плейсхолдеры значениями из аргумента-объекта
  Сигнатура format-функции:
    (vars?: { [key: string]: string | number }) => string

  NOTE: можно использовать готовую реализацию format-функции
 */

/*
  В качестве оригинала даётся объект, представляющий собой дерево заранее неизвестной глубины
  Листья дерева ― строки с {placeholder}'ами

  Результатом должен быть объект такой же формы, как и оригинал
  Листья дерева ― format-функции, заменяющие плейсхолдеры значениями из аргумента-объекта
  Сигнатура format-функции:
    (vars?: { [key: string]: string | number }) => string

  NOTE: можно использовать готовую реализацию format-функции
 */

const sourceStrings = {
  hello: "Добрый вечор, {username}!",
  admin: {
    objectForm: {
      label: "Пароль администратора",
      hint: "Не менее {minLength} символов. Сейчас ― {length}"
    }
  }
};

const t = i18n(sourceStrings);

console.log("🚀 Starting tests...");

console.log(t.hello({ username: "me" }));
const testFormat = "Добрый вечор, me!" === t.hello({ username: "me" });
console.assert(testFormat, "  ❌ First level failed!");

console.log(t.admin.objectForm.label());
const testDepth = "Пароль администратора" === t.admin.objectForm.label();
console.assert(testDepth, "  ❌ Generic depth failed!");

console.log(t.admin.objectForm.hint({ minLength: 8, length: 6 }));
const testDepthFmt =
  "Не менее 8 символов. Сейчас ― 6" ===
  t.admin.objectForm.hint({ minLength: 8, length: 6 });
console.assert(testDepthFmt, "  ❌ Variables failed");

if (testDepth && testDepthFmt && testFormat)
  console.log("🎉 Good! All tests passed.");

// === implementation ===

type Input = {
  [key: string]: string | Input;
};

type Result<T> = {
  [K in keyof T]: T[K] extends string ? Func : Result<T[K]>;
};

type Func = (data?: { [key: string]: string | number }) => string;

function i18n<T extends Input>(strings: T): Result<T> {
  let templatedStrings: Result<T> = <Result<T>>Object.create({});
  for (let key in strings) {
    if (strings.hasOwnProperty(key)) {
      if (typeof strings[key] === "string") {
        (templatedStrings[key] as Func) = <Func>function (data?) {
          let newStr = <string>strings[key];
          if (data) {
            for (let dataKey in data) {
              if (data.hasOwnProperty(dataKey)) {
                newStr = newStr.replace(
                  `{${dataKey}}`,
                  data[dataKey].toString()
                );
              }
            }
          }
          return newStr;
        };
      } else {
        templatedStrings[key] = i18n(strings[key] as Input);
      }
    }
  }
  return templatedStrings;
}

