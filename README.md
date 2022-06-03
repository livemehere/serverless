# serverless 사용해보기

## serverless 란?

> AWS API Gateway + Lambda 을 사용하는 프레임워크

- FaaS : Function as a Service
- 사용하는 이유?
  - 기존의 서버의 문제점 혹은 불편한 점이라고 한다면, 리스소관리나 스케일링이 까다롭다는 점입니다. 그 외에도 서버 하나를 운영하기 위해서는 단순히 코드만 관리해서는 안됩니다. serverless를 사용함으로써 부수적인 일들은 amazon에 맡기고 개발자는 함수만 관리하면 됩니다.
  - 또한 서버가 비대해 질수록 이를 관리해야하는 비용도 줄일 수 있습니다.
- 장점?
  - lambda 에 함수를 등록해 두고, 이벤트가 발생하면 함수를 호출 하는 방식입니다. 그 이벤트는 API Gateway 와 연동되어, api 호출이 이벤트가 되겠죠. 이렇게 이벤트 기반으로 호출되기 때문에 24시간 서버가 동작하고 있지 않고, 그에 따라 호출되는 만큼의 비용만 지불하게 됩니다.
  - 확장에 유연합니다. 기존의 EC2와 같이 서버를 구축해두었을때, 트래픽이 증가한다면 그를 대응하기 위해 Auto Scaling 을 사용해 확장합니다. CPU용량과 네트워크 처리량에 따라 분산처리를 하도록 해주죠. 하지만 FaaS 의 경우엔 별도의 확장이 필요하지 않습니다. 그저 호출되는 만큼 처리하고, 비용을 지불하는 것이죠!
- 단점?
  - 함수가 호출될 때 최대 1500MB의 메모리를 사용할 수 있고, 처리시간은 300초로 제한되어 있습니다. 따라서 웹 소켓같은 경우는 사용이 불가능 합니다.
  - 로컬 데이터 사용이 불가능합니다. 함수는 모두 stateless 하기 때문에, 파일시스템 같은 것에 접근하려면 S3를 이용해야합니다.

## 간단히 템플릿을 이용해서 서버 올려보기

```bash
npm i serverless -g
serverless create --template hello-world
# AWS IAM 계정이 없다면 생성
serverless config credentials --provider aws --key 키 --secret 시크릿키 --overwrite
serverless deploy # 최종 배포
```

> AWS 콘솔에서 API Gateway > Stage 에서 호출할 URL을 확인할 수 있다.
> swagger JSON 파일을 export 할 수 있다. json 파일을 swagger hub 에서 import 해서 문서화 할 수 있다 [swagger hub](https://app.swaggerhub.com/home)


## 테스트

```bash
serverless invoke local --function [호출해볼 함수명] # 개별로 함수 하나씩 호출해보기
```

--- 

```bash
npm install serverless-offline --save-dev # 로컬에서 서버로 실행해서 모든 함수 테스트하기
```

```yaml
# serverless.yml 에 추가
plugins:
  - serverless-offline
```

```bash
serverless offline start --disableCookieValidation # 실행 (offline 으로 실행할 경우 cookie 옵션을 제거해주어야 한다)
```

## serverless.yml

- end-point 를 yml 파일에서 정의해주어야 합니다.
- 이 때문에, swagger, open API 문서화가 자동으로 됩니다.

```yaml
service: serverless-study

frameworkVersion: '3'

# The `provider` block defines where your service will be deployed
provider:
  name: aws
  runtime: nodejs12.x
  region: ap-northeast-2 # 서울
  stage: v2 # 엔드포인트 prefix 라고 생각

functions:
  helloWorld:
    handler: handler.helloWorld # 함수 위치
    events:
      - http:
          path: hello-world # end-point
          method: get
          cors: true

  posts:
    handler: handler.getPosts
    events:
      - http:
          path: posts
          method: get
          cors: true

plugins:
  - serverless-offline
```