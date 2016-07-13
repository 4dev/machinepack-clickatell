module.exports = {

  friendlyName: 'Send text message',

  description: 'Send a text message using the Clickatell SMS API',

  cacheable: false,

  sync: false,

  inputs: {

    user: {
      example: 'companyname',
      description: 'Your Clickatell username.',
      required: true
    },
    password: {
      example: '******',
      description: 'Your Clickatell password',
      required: true
    },
    api_id: {
      example: 'GJD79867',
      description: 'Your Clickatell API id.',
      required: true
    },
    from: {
      example: '2772000000',
      description: 'Sender SMS number.',
      extendedDescription: 'The number may be alphanumeric (Ex: from=MyCompany20). Restrictions may apply, depending on the destination.',
      required: false
    },
    to: {
      example: '2772000000',
      description: 'Recipient SMS number.',
      extendedDescription: 'Mobile number in international format, and one recipient per request. Ex: to=447525856424 or to=00447525856424 when sending to UK.',
      required: true
    },
    text: {
      example: 'Hello world',
      description: 'Body of the text message.',
      extendedDescription: 'Maximum length of a text message is 3200 characters, UTF-8 and URL encoded value.',
      required: true
    }

  },

  exits: {

    error: {
      description: 'Unexpected error occurred.',
      example: 'ERR: 101, Authentication failed'
    },
    wrongOrNoKey: {
      description: 'Invalid or unprovided API key. All calls must have a key.'
    },
    wrongOrNoCredentials: {
      description: 'Invalid username or password.'
    },
    success: {
      description: 'Returns an ID.',
      example: 'f7012c1edff2509a19ce1667c7f52b18'
    }
  },

  fn: function (inputs,exits) {

    var protocol = 'http';
    var baseUrl  = protocol + '://api.clickatell.com/' + protocol;
    var smsUrl   = baseUrl + '/sendmsg';

    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: smsUrl,
      url: '', 
      method: 'get',
      params: {
        user: inputs.user,
        password: inputs.password, 
        api_id: inputs.api_id,
        from: inputs.from,
        to: inputs.to,
        text: inputs.text
      },
      formData: true
    }).exec({
      success: function(result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        return exits.success(responseBody.id);
      },
      forbidden: function (result){
        try {
          if (result.status === 403) {
            return exits.wrongOrNoKey("Invalid or unprovided API key. All calls must have a key.");
          }
        } catch (e) {
          return exits.error(e);
        } 
      },
      unauthorized: function (result){
        try {
          if (result.status === 401) {
            return exits.wrongOrNoCredentials("Invalid username or password");
          }
        } catch (e) {
          return exits.error(e);
        } 
      },
      error: function(err) {
        exits.error(err);
      },
    });
  }
};