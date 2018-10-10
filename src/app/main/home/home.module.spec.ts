import { HomeModule } from './home.module';

describe('UsageModule', () => {
    let usageModule: HomeModule;

    beforeEach(() => {
        usageModule = new HomeModule();
    });

    it('should create an instance', () => {
        expect(usageModule).toBeTruthy();
    });
});
