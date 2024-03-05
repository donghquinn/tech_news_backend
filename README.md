# Tech News Backend

- Scrape Page: https://scrape.donghyuns.com

<img src="images/landing.png"/>
<em>Landing Page</em>

## Hacker News

- Original URL: https://news.ycombinator.com
- Hacker News 1~30위

<img src="images/hacker.png"/>
<em>Hacker News</em>

## ML News

- Original URL: https://allainews.com/?ref=mlnews
- Machine Learning 관련 뉴스

<img src="images/ml.png" />
<em>Machine Learning News</em>

## Geek News

- Original URL: https://news.hada.io
- Geek News

<img src="images/geek.png" />
<em>Geek News</em>

## Data ERD

- Login Function is Work-In-Progress with frontend.

<img src="images/erd_news.png"/>
<em>E-R Diagram</em>

---

--- Legacy ---

## BBC Tech News

- https://www.bbc.com/korean/topics/c2dwqjn99ggt
- BBC 기술 관련 뉴스


## Korean Climate Data

- URL: https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15073861

- 공공API 홈페이지에 가입하고서, Token을 발급받는다.

- http://apis.data.go.kr/B552584/ArpltnInforInqireSvc
  기상청 정보

### 사전 작업

    로컬에 npm/yarn과 prisma를 설치한다
    로컬이 아니더라도 작업할 환경에서

    ```shell
    npm run migrate
    ```

    혹은

    ```shell
    yarn run migrate
    ```

    를 통해 데이터 베이스 마이그레이션

    * 이미 실행 중에 데이터베이스 스키마가 변경되었을 떄

      ```shell
      yarn run db:update
      ```

## 환경변수 설정

    각각 서비스 구동에 필요한 환경변수와 db에 사용할 환경변수를 작성한다.

    - .env
      > APP_PORT=
      > DATABASE_URL="postgresql://user:password@DB_SERVER_IP:DB_PORT/DB_NAME?schema=public"
      > SESSION_SECRET=
      > AUTH_KEY=

    - .postgres.env
      > POSTGRES_USER=user
      > POSTGRES_PASSWORD=password
      > POSTGRES_DB=DB_NAME

## 구동

    후에 db 컨테이너 구동

    ```shell
    sudo docker-compose up -d db
    ```

    그 후에 백엔드 컨테이너 구동

    ```shell
    sudo docker-compose up -d backend
    ```
