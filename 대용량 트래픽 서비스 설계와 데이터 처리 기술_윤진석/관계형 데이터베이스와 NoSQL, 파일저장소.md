### 자료구조
1. 단순구조 Simple Structure : Integer, String..
2. 선형구조 Linear Structure : List, Queue, Stack...
3. 비선형구조 Nonlinear Structure : Tree, Graph...
4. 파일구조 File Structure : Text, Sequence Index ...

#### 1억개의 elements를 갖는 List 구현하기 -> (1) 파일
```
public static void main(String[] args) {
    BigList bigList = new BigList(new File("/tmp/list.seq"));
    for (int i = 0; i < 100000000; i++) {
        bigList.add(i);
    }
    System.out.println(bigList.get(12345678));
    bigList.flush();
    bigList.close();
}

public interface FileBasedList {
    /** 
     * 파일 기반 리스트 컨스트럭터
     * @param path
     * @return list object
     */
     public FileBasedList FileBasedList(File path);
     
     /**
      * @return the size of list
      */
     public int getSize();
     
     /**
      * @param value to be added to list
      */ 
     public void add(int value);
     
     /**
      * @param index specific index of list
      * @return value
      */  
     public int get(int index);
     
     /**
      * Flushes to disk
      */
     public void flush();  
     
     /**
      * Closes FileBasedList
      */
     public void close(); 
}

public class BigList implements FileBasedList {
    public int get(int index) {
        long header = 4;
        file.skip(header + (index * 8));
        int idx = bytesToInt(file.read(4));
        return bytesToInt(file.read(4));
    }
}

// 한 요소의 schema
public class Element() {
    int index;
    int value;
    
    ...
    readFields(InputStream in);
    writeFields(OutputStream out);
}
```

#### 1억개의 elements를 갖는 List 구현하기 -> (2) DB
```
bigList(
    id int(4) auto_increment,
    value int(4)
    );

get(int index) {
    q = "select value from bigList where id =" +index;
    return q.result();
}

add(int value) {
    q = "insert into bigList(value) values("+value+");";
    q.executeStatement();
}
```

- 코드와 SQL을 보면 형태가 다를 뿐 같은 원리라는 것을 알 수 있다
- 파일 형태와 DB는 4byte의 헤더와 4byte의 idx, 4byte의 value를
파일에 연속적으로 넣을 지, 헤더를 스키마로 해서 row형태로 저장할지의 차이라고 볼 수 있다.
해당 스토리지 데이터 파일을 parser를 통해 sql 문법으로 표현하고 조작할 수 있는 것이다.
  
#### 만일 list.remove()가 발생하면?
- 위치 이동 후 좌우로 풀 스캔을 사용한다. 최악의 경우 O(n)
- DB는 이러한 것을 막기 위해 indexing 기법을 사용한다
    - Tree 형태로 인덱스 파일을 생성하여, 중간의 값이 사라져도 특정 인덱스의 pos값 복잡도는 O(log n)으로 줄일 수 있다
    
### Revisit to 자료구조
- 프로그래밍 언어에 대부분 존재하는 built-in 자료구조
    - 메모리 또는 디스크에 쓰고 읽을 수 있다
- 관계형 DBMS이건, NoSQL이건, 파일이건
    - 기본적인 자료구조의 데이터 저장소이다.

* SQLite와 같은 경량 파일 DBMS? -> 파일 데이터 프로세싱 프로그램
* Redis와 같은 In-memory Hash 테이블 저장소? -> 데이터 관리 서버 구현

## 자료구조를 잘 안다면 어떤 DB든 간에 대략적인 저장 방식과 복잡도를 추측할 수 있다.
## 데이터베이스는 결국 자료구조의 저장소이다.

### 데이터처리의 성능 차이  - row 기반, column 기반 db 자료 찾아서 정확히 이해할 것!!
- DB 성능차이
    - Row-wise store => 훨씬 느림 : RDBMS가 기본적으로 Row-Column중 Row 단위의 저장구조
    - Column-wise store => 훨씬 빠름
    - 왜?
        - Row 중심의 경우 스토리지에 데이터를 '직렬화' 하여 저장한다
        속도 지연이 발생하는 경우는 대부분 데이터를 찾는 상황에서 발생한다.
        RDBMS는 인덱싱을 통해 전체 데이터의 집합을 읽어 내려가는 속도를 개선
        인덱스는 일반적으로 원본 테이블보다 훨씬 작은 구조를 갖게 됨.   
        
- RDBMS의 경우 이런 문제 해결을 위해 테이블 파티셔닝을 활용
    - Vertical Partitioning
        - 특정 칼럼 풀 스캔이나, ad-hoc query가 많을 때 (JOIN 연산이 많아질 수 있다)
    - Horizontal Partitioning (샤딩)
        - 분산 처리에 용이 (단, 관리 및 프로세싱 복잡도 증가)

- 저장 공간 효율 측면
    - Row Store: Stride Access
        - 고정된 스키마 & 공간 확보 필요
    - Column Store: Attribute Vector
        - 스키마 변경 용이, 탄력적 공간 활용

### NoSQL의 출현
#### 앞서 소개된 여러 기법 중 장점만 모은 것이 NoSQL의 기본 형태
* Scheme-free (스키마 변경 용이)
* Sharding (분산 저장)
* Distributed Query Processing (분산 처리)
* Compact Store(압축 저장)
-> NoSQL 은 대부분 Column Store의 특징을 모두 갖고있다.

  
### 일반적 저장소 선택
- 접근 빈도가 낮은 데이터 : 파일 저장
    - 시스템 로그, 접속 로그 등
- 다양한 분석이 필요한 데이터 : NoSQL 저장
    - 행동 로그, 검색 내역 등
- 서비스 상 실시간 성능과 안정성을 요구하는 데이터 : Multi-DB 혼합
    - 서비스 로그, 결제 이력과 같은 트랜잭션 결과 등
    - RDBMS, RTDB, Time-series DB, NoSQL, In-memory DB..
    
### 컬럼 DBMS와 로우 DBMS의 선택
- 반드시 로그를 남겨야 하는 시스템과 다중 동시성제어가 필요한 업무는 로우 기반 시스템이 적절하다
    - 성능을 높이려면 파티셔닝, 인덱싱, 캐싱 등을 이용해야함
- 대용량 데이터를 빠르게 분석해야 하는 시스템은 컬럼 기반 시스템이 더 적합하다.
