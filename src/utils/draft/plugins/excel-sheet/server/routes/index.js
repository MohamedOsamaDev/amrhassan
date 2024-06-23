module.exports = [
  {
    method: 'POST',
    path: '/export',
    handler: 'myController.export',
    config: {
      policies: [],
      
    },
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'myController.import',
    config: {
      policies: [],
      
    },
  },
];
