# Magical Apollo client!

## apollo-client 의 state-manager적 활용

잘 쓰면 GraphQL 문법으로 데이터를 가져오는 client-side의 Database다!

## Apollo client는 상태관리를 어떻게 하는가.

### 진실의 원천(Source of truth) apollo-client cache object

언제 어디서든 window에 달라붙어있는 글로벌 객체 `__APOLLO_CLIENT__`에서 조회할 수 있다.
=>`__APOLLO_CLIENT__.cache.data.data`

### client-side의 데이터베이스, Cache Normalization

![image](https://media.oss.navercorp.com/user/25908/files/4bdd9e80-173a-11ec-97b1-d04d1f9797bb)

```json
{
  "ROOT_MUTATION": { "__typename": "Mutation" },
  "ROOT_QUERY": {
    "__typename": "Query",
    "getUser({\"userId\":\"cdefg\"})": { "__ref": "User:cdefg" },
    "getUsers({})": [{ "__ref": "User:abcde" }, { "__ref": "User:cdefg" }]
  },
  "User:cdefg": {
    "id": "cdefg",
    "__typename": "User",
    "name": "홍길동",
    "status": "나쁨",
    "totalFollowers": 20
  },
  "User:abcde": {
    "id": "abcde",
    "__typename": "User",
    "name": "오제관",
    "status": "좋음",
    "totalFollowers": 17
  }
}
```

- 핵심은 `__typename` + `id` 로 레코드를 구분한다는 것이다.
- 때문에 ID 타입으로 선언하지 않은 녀석들은 캐싱해놔도 못 사용해 먹는다.
- normalization을 통해 정말 DB처럼 데이터의 중복을 줄이고, 참조로 두어 하나의 데이터를 오로지 하나의 레코드로 관리하게 해준다.

### 모든 쿼리와 뮤테이션의 결과가 cache object에 저장된다.

![image](https://media.oss.navercorp.com/user/25908/files/67e14000-173a-11ec-8753-231670d28021)

```
구조
├── ROOT_QUERY
│     ├── getUser : {__ref:"user:}
│     ├── getUser({userId:"abcde"})
│     └── getUsers
├── ROOT_MUTATION
├── `User:typeId` : TypeObject
│   ....
└── `typename:typeId` : TypeObject
```

쿼리의 결과는 normalized 되서 저장되고, 뮤테이션의 경우 반환값이 normalization될 수 있는 형태로 온다면(type+id)
놀랍게도 apollo-client는 refetch 없이 바로 해당 데이터를 업데이트 시켜준다.
즉 id 3번의 유저를 업데이트하고 mutaiton이 업데이트된 유저를 리턴한다면, apollo-client는 캐시의 User:3을 뮤테이션의 결과로부터 업데이트 시킨다. 때문에 쿼리로 User:3을 바라보고있던 컴포넌트들도 업데이트가 된다.
매번 mutation 질의를 날리고, context로부터 refetch를 내려받아서 실행하고... 이런 것을 안해도 된다!!

### fetchPolicy와 cache layer

캐쉬 레이어는 일종의 리덕스 storage라고 생각할 수 있습니다.

단 `fetchPolicy`가

- `cache-first` : 캐쉬에 대해 질의 => (있으면) 리턴! => (없으면) 네트워크 질의 => 응답을 캐쉬에 저장 => 리턴!
- `cache-only` : 캐쉬에 대해 질의 => (있으면) 리턴! => (없으면) throw!
- `cache-and-network` : 캐쉬에 대해 질의 => (있으면) 일단 리턴! => (있든 없든) 네트워크 질의 => 응답을 캐쉬랑 비교해봄 => 달라졌으면 캐쉬값 업데이트 => 해당 캐쉬를 가져다 쓰는 녀석들 다 업데이트됨!
- `network-only` : 바로 네트워크 질의 => 응답을 캐쉬에 저장 => 리턴!
- `no-cache` : 바로 네트워크 질의 => 리턴!

### 진짜 Context 다 대체 돼? 로컬에서만 이뤄지는 건 어떡하게??

로컬 쿼리를 만들어서 쓰면됩니다!

### 잘 활용하기 위해서 다음을 지켜야한다.

1. 정규화를 지켜야 한다. `__typename:${id}`로 관리된다는 것을 잊지말자. 하나의 Entity의 PK에 해당하는 ID에 해당 Entity가 묶여있어야한다.(ID를 명시적으로 정하면 해당 아이템이 캐싱되지만 명시적으로 정하지 않으면 되지 않는다.)

2. mutation의 결과는 ID를 가진 해당 타입을 리턴하게 => refetch를 선언하지 않고도 자동 반영되버릴 수 있다!

3. context api의 대체 => page에서 페칭, context api 쓰던 하위 컴포넌트는 cache-first로 필요한 데이터가져오기

https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/
