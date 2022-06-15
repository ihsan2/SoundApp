import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';
import {Text as TextSVG} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let classes = [
  {name: 'bicara', val: 1},
  {name: 'diam', val: 2},
  {name: 'hujan', val: 3},
  {name: 'kursi', val: 4},
];

const Home = ({navigation}) => {
  const [dataSound, setDataSound] = useState(
    `0$$0&&""#0.00#0.10#0.00#0.00#0.27#0.54#0.07#0.00#0.01`,
  );
  const [level, setSoundLevel] = useState('');
  const [duration, setSoundDuration] = useState('');
  const [type, setSoundType] = useState('');
  const [value, setSoundValue] = useState('');
  const [isOn1, setIsOn] = useState('off');
  const [isSpeaker, setIsSpeaker] = useState('');

  const [list, setListClass] = useState([]);

  useEffect(() => {
    _getClasses();
    _getSpeaker();
    // _getData();
  }, []);

  const _getData = arr => {
    database()
      .ref('/Classes/data1')
      .on('value', snapshot => {
        let snap = snapshot.val();
        let snapSplit = snap.split(' ');
        let data = snapSplit[snapSplit.length - 1];
        let soundLevel;
        let soundDuration;
        let soundType;
        let ix;
        let soundValue;
        let onSpeaker;
        if (data == '') {
          soundLevel = level;
          soundDuration = duration;
          soundType = type;
          soundValue = value;
          onSpeaker = isOn1;
        } else {
          soundLevel = data.includes('$$') ? data.split('$$')[0] : level;
          soundDuration =
            data.includes('&&') && data.includes('$$')
              ? data.split('$$')[1].split('&&')[0]
              : duration;
          soundType =
            data.includes('&&') && data.includes('#')
              ? data.split('&&')[1].split('#')[0]
              : type;
          ix = arr.filter(el => el?.name === soundType)[0];
          soundValue =
            data.includes('&&') && data.includes('#')
              ? data.split('&&')[1].split('#')[ix?.value]
              : value;
          onSpeaker =
            data.includes('&&') && data.includes('$$')
              ? data.split('&&')[0].split('$$')[2]
              : isOn1;
        }

        setSoundLevel(soundLevel);
        setSoundDuration(soundDuration);
        setSoundType(soundType);
        setSoundValue(soundValue);
        setIsOn(onSpeaker);
      });
  };

  const _getClasses = () => {
    database()
      .ref('/list')
      .on('value', snapshot => {
        let snap = snapshot.val();
        let arr = [];
        for (let x in snap) {
          let obj = {
            name: snap[x],
            value: Number(x) + 1,
          };
          arr.push(obj);
        }
        _getData(arr);
      });
  };

  const _getSpeaker = () => {
    database()
      .ref('/speaker')
      .on('value', snapshot => {
        let snap = snapshot.val();
        setIsSpeaker(snap);
      });
  };

  const _getLevelLabel = lev => {
    let label = '';
    if (Number(lev) <= 60) label = 'Quite';
    else if (Number(lev) > 60 && Number(lev) <= 85) label = 'Medium';
    else if (Number(lev) > 85) label = 'High';

    return `${label}`;
  };

  const _doSpeaker = () => {
    let val = isSpeaker == 'Y' ? 'N' : 'Y';

    database()
      .ref('/speaker')
      .set(val)
      .then(() => console.log('speaker updated.'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{position: 'absolute', right: 24, top: 24}}
        onPress={() => navigation.navigate('History')}>
        <Icon name="timetable" size={36} color="#62A1A9" />
      </TouchableOpacity>
      <View style={styles.level}>
        <Speedometer
          value={level.replace(/[^\d.-]/g, '')}
          max={140}
          angle={160}
          fontFamily="squada-one">
          <Background angle={180} />
          <Arc />
          <Needle />
          <Progress />
          <Marks />
          <Indicator>
            {(value, textProps) => (
              <>
                <TextSVG
                  {...textProps}
                  fontSize={24}
                  fill="#555"
                  y={170}
                  x={40}
                  textAnchor="start"
                  fontFamily="squada-one"></TextSVG>
              </>
            )}
          </Indicator>
        </Speedometer>
        <Text style={styles.level_text}>
          {level.replace(/[^\d.-]/g, '')} dB - {_getLevelLabel(level)}
        </Text>
      </View>

      <View style={[styles.view_type]}>
        <View style={styles.type_section}>
          <Icon name="music-box" color={'#8CC6F7'} size={54} />
          <Text style={styles.text}>
            Suara {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        <View style={styles.type_section}>
          <Icon name="information" color={'#8CC6F7'} size={54} />
          <Text style={styles.text}>{value.trim().substring(0, 4)}</Text>
        </View>
      </View>

      <View style={[styles.view_type, {marginTop: 36}]}>
        <View style={styles.type_section}>
          <Icon name="timer" color={'#8CC6F7'} size={54} />
          <Text style={styles.text}>{duration} s</Text>
        </View>
        <View style={styles.speaker_section}>
          <Icon
            name={
              isOn1 == 'on' && isSpeaker == 'Y' ? 'volume-high' : 'volume-off'
            }
            color={isOn1 == 'on' && isSpeaker == 'Y' ? '#13B52E' : '#FC1313'}
            size={54}
          />
          <Text style={styles.text}>
            Speaker - {isOn1 == 'on' && isSpeaker == 'Y' ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          _doSpeaker();
        }}
        style={[
          styles.btn,
          {backgroundColor: isSpeaker == 'Y' ? '#FC1313' : '#13b344'},
        ]}>
        <Text style={styles.btn_label}>
          {isSpeaker == 'Y' ? 'Turn Off Speaker' : 'Turn On Speaker'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 120,
  },
  level: {
    alignItems: 'center',
    marginBottom: 80,
  },
  text: {
    fontSize: 20,
    color: '#8C8C8C',
    marginTop: 8,
    textAlign: 'center',
  },
  view_type: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -36,
  },
  type_section: {
    flex: 1,
    alignItems: 'center',
  },
  speaker_section: {
    flex: 1,
    alignItems: 'center',
  },
  btn: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 36,
  },
  btn_label: {
    fontSize: 18,
    color: '#fff',
  },
  level_text: {
    color: 'grey',
    marginTop: -100,
    textAlign: 'center',
    fontSize: 28,
  },
});

export default Home;
