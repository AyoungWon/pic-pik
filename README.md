# PicPik

PicPik은 image 파일 선택시 파일에 대한 데이터와 meta 정보를 손쉽게 얻을 수 있게 하는 오픈소스 라이브러리입니다.

# 기본 기능

- image 파일 데이터 제공(확장자, width, height, src, 파일 사이즈)
- 파일에 대한 width, height, 확장자, 파일 사이즈 제한 가능

# 설치 방법

```bash
npm install pic-pik
```

# 사용 예시

## ImageUploader 컴포넌트를 사용하기

```js
<ImageUploader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
  }}
  validateOptions={{
    width: {
      max: 3000,
      onError: (error) => {
        console.log(error);
      },
    },
    height: 3000,
  }}
>
  <button>Select Image File</button>
</ImageUploader>
```

### accept(optional, default: image/\*)

`accept`를 사용하여 허용할 이미지 파일 확장자를 지정합니다.

```js
<ImageUploader
  accept=".jpg, .jpeg" // .png, .webp, .gif...
>
  Select
</ImageUploader>
```

### validateOptions(optional)

`validateOptions`으로 `width`, `height`, `size(용량)`을 제한할 수 있습니다.

```js
<ImageUploader
  validateOptions={{
    width: {
      max: 3000,
      onError: (error) => {
        console.log(error);
        // {field:"width", max: 3000, selectedFileValue: 3600}
      },
    },
    height: 3000,
  }}
>
```

각 항목의 형태는 `number`이거나 `{max:number, onError?:(error:ValidateError)=>void}`형태입니다.

### onMetadataLoaded

`onMetadataLoaded`를 이용하여 image 파일 선택후 파일의 `metadata`를 알아 낼 수 있습니다.

```js
<ImageUploader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
    // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
  }}
>
  <button>Select Image File</button>
</ImageUploader>
```

## useImageMetadata hook 사용하기

`useImageMetadata`를 사용하여 자유롭게 `input`을 커스터마이징 할 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata({
  validateOptions: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});

return (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <input ref={ref} type="file" accept=".jpg, .jpeg" />
    {imageMetadata && (
      <img
        style={{ width: imageMetadata.width, height: imageMetadata.height }}
        src={imageMetadata.src}
        alt="image file"
      />
    )}
  </div>
);
```

### ref

`input` 태그의 ref에 `useImageMetadata`로부터 받은 `ref`를 전달합니다.

```js
const { ref } = useImageMetadata();

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### imageMetadata

`ref`로 참조한 file `input`을 사용하여 파일을 선택한 경우, `imageMetadata`로 해당 이미지 파일의 관련 metadata를 조회 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata();

useEffect(() => {
  if (imageMetadata) console.log(imageMetadata);
  // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
}, [imageMetadata]);

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### validateOptions

`useImageMetadata`에 `validateOptions`를 전달하여, `width`, `height`, `size(용량)`에 대한 제한과 에러 처리를 할 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata({
  validateOptions: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});
```

## validateOptions 상세

`validateOptions`로 제한할 있는 필드는 `width`, `height`, `size` 총 3가지 입니다. 각 필드는 optional값이므로 필요한 경우에만 사용할 수 있습니다.

### max 제한하기

모든 필드는 값과 객체, 2가지 방법으로 제한할 수 있습니다.

```js
// max 값으로 제한하기
const validateOptions = { width: 300, height: 500, size: 1024 };
const validateOptions = { height: 500, size: 1024 };
const validateOptions = { width: 300 };
const validateOptions = { height: 500 };
```

```js
// condition 객체로 제한하기
const validateOptions = {
  width: { max: 300, onError: (error) => console.log("width error", error) },
  height: { max: 5000 },
};

// max와 condition 객체 홉합 사용
const validateOptions = {
  width: 500,
  height: { max: 5000, onError: (error) => console.log("height error", error) },
};
```

### onError

`validationOptions`의 항목에 `condition` 객체를 사용하고, `max`값을 초과할 경우 실행되는 `onError`가 실행됩니다. `onError`의 인자로 전달되는 `error` 객체의 내용은 다음과 같습니다.

```js
validateOptions={{
    width: {
      max: 3000,
      onError: (error) => {
        console.log(error);
        // {field:"width", max: 3000, selectedFileValue: 3600}
      },
    },
    height: 3000,
  }}
```

- `field`: error가 발생한 필드 값
- `max`: 제한한 값
- `selectedFileValue`: 선택된 파일의 해당 필드 값

`condition` 객체의 `onError`는 `optional` 값이며, 입력하지 않을 경우 default 함수는 다음과 같습니다.

```js
() =>
  console.error(
    `이미지 파일의 ${field}는 ${max}${unit ?? ""}보다 작거나 같아야합니다.`
  );

// ex
// 이미지 파일의 width는 500px보다 작거나 같아야합니다.
// 이미지 파일의 size는 1024kb보다 작거나 같아야합니다.
```

## unit

각 필드에 해당하는 단위는 다음과 같습니다.

- `width`: `px`
- `height`: `px`
- `size`: `kb`

# License

This project is licensed under the terms of the MIT license.
