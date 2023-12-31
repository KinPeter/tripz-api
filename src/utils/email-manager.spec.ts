import { EmailManager } from './email-manager.js';

describe('EmailManager', () => {
  it('should call createTransport function when sending a login code email', () => {
    const createTransportFn = jasmine.createSpy('createTransport');
    const transporterSpy = jasmine.createSpyObj('transporter', ['sendMail']);
    createTransportFn.and.returnValue(transporterSpy);
    const emailManager = new EmailManager(createTransportFn);
    emailManager.sendLoginCode('test@test.com', '123123', 'token');
    expect(createTransportFn).toHaveBeenCalled();
    expect(transporterSpy.sendMail).toHaveBeenCalled();
  });

  it('should call createTransport function when sending a notification email', () => {
    const createTransportFn = jasmine.createSpy('createTransport');
    const transporterSpy = jasmine.createSpyObj('transporter', ['sendMail']);
    createTransportFn.and.returnValue(transporterSpy);
    const emailManager = new EmailManager(createTransportFn);
    emailManager.sendSignupNotification('test@test.com');
    expect(createTransportFn).toHaveBeenCalled();
    expect(transporterSpy.sendMail).toHaveBeenCalled();
  });
});
