---
title: 'CSV to JSON'
categories:
  - programming
tags:
  - JavaScript
date: 2020-12-26 22:00:00
description: '평소 써보고 싶었던 Deno로 가볍게 CSV to JSON Converter를 구현했다'
slug: csv-to-json
---

종종 CSV 형식의 파일을 JSON 형식으로 바꿔야 하는 일이 생긴다. 그럴 때마다 구글에 'csv to json'라고 검색해서 나오는 웹 사이트에 CSV 파일을 붙여넣어 JSON 값을 받아내곤 했다. 깔끔하게 구현된 서비스가 많아서 불편함은 없었지만 별로 어렵지도 않은 변환기를 하나쯤 직접 만들어둬도 좋겠다는 생각이 들었다.

평소 써보고 싶었던 Deno로 가볍게 [CSV to JSON Converter](https://github.com/hajoeun/learn-deno/tree/master/csv-to-json)를 구현했다. 실제 로직은 자바스크립트와 다르지 않고 파일을 읽고 쓰는 부분만 Deno의 API를 활용한다.

### CSV: sample.csv

```spreadsheet
id,name,age,gender,email
1,joeun,30,male,joeun@email.com
2,goeun,28,female,
```

오늘의 재료는 ID와 이름, 나이, 성별 그리고 이메일 정보를 담고 있는 CSV 형식의 텍스트다. 특이한 점은 두 번째 항목에는 이메일 주소가 공란이라는 점이다.

### JSON: sample.json

```json
[
  {
    "id": "1",
    "name": "joeun",
    "age": "30",
    "gender": "male",
    "email": "joeun@email.com"
  },
  {
    "id": "2",
    "name": "goeun",
    "age": "28",
    "gender": "female",
    "email": ""
  }
]
```

결과물은 CSV 파일을 변환한 JSON 형식의 텍스트다. 입력되지 않은 데이터는 빈 문자열(`""`)로 처리하고 있다.

### Code: csv-to-json.js

```javascript
const filenames = Deno.args;

for (const filename of filenames) {
  const csvText = await Deno.readTextFile(filename);
  const outputName = filename.replace(".csv", ".json");
  const jsonText = converter(csvText);

  await Deno.writeTextFile(outputName, jsonText);
}

function converter(csvText) {
  const [columns, ...rows] = csvText.trim(/\s/g).split("\n");
  const keys = columns.split(",");
  const valuesArray = rows.map((row) => row.split(","));
  const jsonText = valuesArray.map((values) => (
    values.reduce((acc, v, i) => {
      acc[keys[i]] = v;
      return acc;
    }, {})
  ));

  return JSON.stringify(jsonText, null, "  ");
}
```

CLI에서 입력한 문자열을 `Deno.args`라는 배열로 받는다. 파일 이름을 전달받아 내용을 읽을 예정이니 `filenames`라고 이름 지었다. 여러 개의 파일을 순회한다는 가정으로 반복문을 열고 파일을 하나씩 조회한다.

이때 파일을 읽기 위해 사용하는 Deno API가 `Deno.readTextFile`이다. Deno의 재미난 점 중 하나가 최상위 환경에서부터 `await`을 사용할 수 있다는 점. 실행 환경이 애초에 비동기 환경에서 시작하는 것이다. `async`로 전역이 감싸진 상태라고 이해하면 쉽다.

읽어 들인 텍스트를 만들어 둔 `converter` 함수의 인자로 전달한다. `converter` 함수는 JSON으로 변환된 텍스트를 반환하고 끝으로 파일 쓰기 API인  `Deno.writeTextFile` 를 사용해 파일을 저장하면 끝.

### Run

```bash
deno run --allow-read --allow-write csv-to-json.js sample.csv
```

실행 명령어에서 눈여겨볼 점은 읽고 쓰는 권한을 줘야만 한다는 점. 보안에 특히 신경을 쓴 Deno의 특징이 드러나는 부분이다.
