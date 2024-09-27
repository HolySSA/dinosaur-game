class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }

    Singleton.instance = this;
  }

  // 싱글톤 인스턴스를 반환하는 정적 메서드
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    
    return Singleton.instance;
  }
}

export default Singleton;