import * as sinon from "sinon";

interface StubMultipleConfig {
  object: any;
  method: string;
  returns?: any;
  isNotMethod?: boolean;
}

interface RestoreStubbedMultipleConfig {
  object: any;
  method: string;
}

export const stubMultiple = (configList: StubMultipleConfig[]) => {
  const stubArray: sinon.SinonStub<any[], any>[] = [];
  configList.forEach((config: StubMultipleConfig) => {
    const stub = sinon.stub(config.object, config.method);
    config.returns && config.isNotMethod
      ? stub.value(config.returns)
      : stub.returns(config.returns);

    stubArray.push(stub);
  });

  return stubArray;
};

export const restoreStubbedMultiple = (
  configList: RestoreStubbedMultipleConfig[]
) => {
  configList.forEach((config: RestoreStubbedMultipleConfig) => {
    config.object[config.method].restore();
  });
};
