const toObject = (headers, row) => {
    if (headers.length != row.length) return {};
    var obj = {};
    for (var i=0; i<headers.length; i++) {
      obj[headers[i]] = row[i];
    }
    return obj;
  };

const toObjectArray =(cols,rows) => {
    return rows.map(row => {
      return toObject(cols, row);
    });
  };


const getEmotion = (text) => {
    const types = [{
        values: ['happiest', 'happy'],
        emotion: 'joy'
    }, {
        values: ['angry', 'angriest'],
        emotion: 'anger'
    }, {
        values: ['saddest', 'sad'],
        emotion: 'sadness'
    }, {
        values: ['fear', 'most fearful'],
        emotion: 'fear'
    }, {
        values: ['disgust', 'most disgusted'],
        emotion: 'disgust'
    }];

    let result = null;
    types.forEach(type => {
        type.values.forEach(value => {
            if (text.includes(value)) {
                result = type.emotion;
            }
        })
    })
    console.log('emotion: ', result);

    return result;
};

module.exports= {
  toObject: toObject,
  toObjectArray: toObjectArray,
  getEmotion:getEmotion
};
