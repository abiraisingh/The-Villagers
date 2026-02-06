export interface Village {
  id: string;
  name: string;
}

export interface PincodeResponse {
  code: string;
  state: string;
  district: string;
  villages: Village[];
}

export interface Story {
  id: string;
  title: string;
  originalText: string;
  originalLang: string;
  createdAt: string;
  author: {
    email: string;
  };
}
