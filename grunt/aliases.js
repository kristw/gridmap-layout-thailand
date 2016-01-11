module.exports = {
  'publish:patch': {
    description: 'Bundle code, bump version by 0.0.1 and publish to npm and bower',
    tasks: [
      'bump:patch',
      'shell:publish'
    ]
  },
  'publish:minor': {
    description: 'Bundle code, bump version by 0.1 and publish to npm and bower',
    tasks: [
      'bump:minor',
      'shell:publish'
    ]
  },
  'publish:major': {
    description: 'Bundle code, bump version by 1 and publish to npm and bower',
    tasks: [
      'bump:major',
      'shell:publish'
    ]
  },
  'publish': ['publish:patch']
};