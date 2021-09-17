# Magical Apollo client! ⭐

잘 쓰면 GraphQL 문법으로 데이터를 가져오는 client-side의 Database다!

## Cache : 진실의 원천(Source of truth)

`new InMemoryCache()`로 정의한 것은 글로벌 객체 `__APOLLO_CLIENT__`의 `cache` 프로퍼티로 접근할 수 있습니다.
이를 통해 언제든 어떤 데이터들이 캐쉬되어있는지 볼 수 있고, 가져와 컴포넌트에 뿌려줄 수 있어요.

`__APOLLO_CLIENT__.cache.data.data`
![image](https://media.oss.navercorp.com/user/25908/files/4bdd9e80-173a-11ec-97b1-d04d1f9797bb)

## Cache + Normalization = Client-side의 데이터베이스가 되다

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

- 크게 두축으로 저장합니다.
  1.  `ROOT_{QUERY|MUTATION}` 으로 쿼리나 뮤테이션의 이름과 결과를 key value pair로 저장합니다.
  2.  normalization 할 수 있는 데이터는 참조로만 두고 최상위 depth로 가져와 따로 저장합니다.
- 아폴로 클라이언트는 type과 id필드가 있는 데이터에 한해 normalization을 자동으로 해줍니다.
- 이를 통해 정말 DB처럼 데이터의 중복을 줄이고, nested된 레코드를 오로지 참조만 하게 하여 하나의 데이터를 오로지 하나의 레코드로 관리하게 해줍니다.
- 핵심은 `__typename` + `id` 로 레코드를 구분한다는 것입니다.
- 때문에 ID 타입으로 선언하지 않은 녀석들은 캐싱해놔도 다른 곳과 공유가 안됩니다.(정확히 말하면 normalization이 안됩니다. 그래서 한쪽에서 mutation으로 바꿔도 다른 모든 곳에서 그 데이터가 업데이트되지 않습니다.)
- 모든 쿼리의 결과가 cache object에 저장됩니다.
- 뮤테이션의 결과로 type + id를 읽을 수 있으면, 따로 무언갈 하지 않아도 해당 데이터를 업데이트 시켜줍니다.

> 쿼리의 결과는 normalized 되서 저장되고, 뮤테이션의 경우 반환값이 normalization될 수 있는 형태로 온다면(type+id)
> 놀랍게도 apollo-client는 refetch 없이 바로 해당 데이터를 업데이트 시켜준다.
> 즉 id 3번의 유저를 업데이트하고 mutaiton이 업데이트된 유저를 리턴한다면, apollo-client는 캐시의 User:3을 뮤테이션의 결과로부터 업데이트 시킨다. 때문에 쿼리로 User:3을 바라보고있던 컴포넌트들도 업데이트가 된다.
> 매번 mutation 질의를 날리고, context로부터 refetch를 내려받아서 실행하고... 이런 것을 안해도 된다!!

## fetchPolicy와 cache

![Apollo-5](https://media.oss.navercorp.com/user/25908/files/5c772e80-17a5-11ec-93ab-f1b08adeeb90)

- `cache-first`(default) : 캐쉬에 대해 질의 => (있으면) 리턴! => (없으면) 네트워크 질의 => 응답을 캐쉬에 저장 => 리턴!
- `cache-only` : 캐쉬에 대해 질의 => (있으면) 리턴! => (없으면) throw!
- `cache-and-network` : 캐쉬에 대해 질의 => (있으면) 일단 리턴! => (있든 없든) 네트워크 질의 => 응답을 캐쉬랑 비교해봄 => 달라졌으면 캐쉬값 업데이트 => 해당 캐쉬를 가져다 쓰는 녀석들 다 업데이트됨!
- `network-only` : 바로 네트워크 질의 => 응답을 캐쉬에 저장 => 리턴!
- `no-cache` : 바로 네트워크 질의 => 리턴!

### cache

캐쉬 레이어는 일종의 리덕스 storage라고 생각할 수 있습니다.

- 데이터를 가져다 쓰는 컴포넌트들은 데이터의 업데이트에 즉각 리렌더링 됩니다.
- 수신하는 데이터의 변화에만 리렌더링됩니다. 이점에서 Context API보다 크게 코스트가 감소합니다.
- 리덕스의 dispatch 같은 역할을 다음처럼 할 수 있습니다.
  - mutation을 통해 (리턴값이 type + id로 잘 온다면 자동으로 업데이트)
  - writeQuery를 통해

캐쉬는 어떤게 있을지 선언적으로 알 수는 없으나, 페이지 내에서 먼저 페칭하는 데이터를 알 수는 있습니다. 먼저 페칭하는 것을 하위 컴포넌트들이 수신(cache로 읽기)하는 구조로 간다면 한번의 network요청으로 모든 컴포넌트들이 그려질 수 있습니다.

## 진짜 Context 다 대체 돼? 로컬에서만 이뤄지는 건 어떡하게??

로컬 쿼리를 만들어서 쓰면됩니다! 👉 [여기](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/)

## 잘 활용하기 위해 지켜야할 것들

![Apollo-3](https://media.oss.navercorp.com/user/25908/files/2a180200-17a2-11ec-8f0b-a40a53dba0be)

1. 정규화를 지켜야 한다. 레코드는 `{__typename}:{id}`로 관리된다는 것을 잊지말자. 하나의 Entity의 PK에 해당하는 ID에 해당 Entity가 묶여있어야한다.(꼭 ID 타입의 필드일 필요는 없다, String 타입의 필드여도 이것이 ID역할을 한다고 `typePolicy`의 `keyField`로 지정해줄 수 있다)

2. mutation의 결과는 ID를 가진 해당 타입을 리턴하게 => refetch를 선언하지 않고도 자동 반영되버릴 수 있다!

3. Page에서만 network를 타고 나머지는 cache로\
   context api의 대체 => page에서 페칭, context api 쓰던 하위 컴포넌트는 cache-first로 필요한 데이터 가져오기

4. 구분을 잘하자. 무조건 useQuery로 접근할 필요는 없다. 리스트 하위의 아이템의 경우 이러한 데이터를 props로만 받는게 적합하다.
