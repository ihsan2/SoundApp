import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const History = () => {
  const [list, setList] = useState([]);
  const [all, setAll] = useState([]);
  const [load, setLoad] = useState(false);

  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    _getData();
  }, []);

  const _getData = () => {
    setLoad(true);
    database()
      .ref('/history')
      .once('value')
      .then(snapshot => {
        let data = [];
        snapshot.forEach(child => {
          data.push(child.val());
        });
        setList(data);
        setAll(data);
        setLoad(false);
      });
  };

  if (load) {
    return (
      <ActivityIndicator
        style={{marginTop: 24}}
        size={'large'}
        color={'#19797F'}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <DatePicker
        modal
        open={open}
        date={date ?? new Date()}
        onConfirm={date => {
          setOpen(false);
          setDate(date);

          let f = all.filter(
            el =>
              moment(el?.created_at, 'YYYY-M-D').format('YYYY/MM/DD') ===
              moment(date, 'YYYY-M-D').format('YYYY/MM/DD'),
          );
          setList(f);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{
            borderWidth: 1,
            padding: 16,
            borderRadius: 5,
            backgroundColor: '#fff',
            borderColor: '#dadada',
            flex: 1,
          }}>
          <Text>
            {date ? moment(date).format('DD MMM YYYY') : 'Select Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingLeft: 16}}
          onPress={() => {
            _getData();
            setDate(null);
          }}>
          <Icon name="refresh" size={40} color={'#62A1A9'} />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            flex: 2,
            backgroundColor: '#BCBCBC',
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#C4CFCD',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>Tanggal</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#6F938E',
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#C4CFCD',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 12, color: '#fff'}}>
            Bicara
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#C2DFDB',
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#C4CFCD',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 12}}>Hujan</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#6F938E',
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#C4CFCD',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 12, color: '#fff'}}>
            Kursi
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#C2DFDB',
            padding: 12,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: '#C4CFCD',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 12}}>Senyap</Text>
        </View>
      </View>

      {list.length > 0 ? (
        list.map((el, key) => {
          return (
            <View key={key} style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 2,
                  backgroundColor: '#BCBCBC',
                  padding: 12,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 14}}>
                  {moment(el?.created_at, 'YYYY-M-D').format('DD MMM YYYY')}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#6F938E',
                  padding: 12,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 12, color: '#fff'}}>
                  {el?.bicara}s
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#C2DFDB',
                  padding: 12,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 12}}>
                  {el?.hujan}s
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#6F938E',
                  padding: 12,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 12, color: '#fff'}}>
                  {el?.kursi}s
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#C2DFDB',
                  padding: 12,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 12}}>
                  {el?.senyap}s
                </Text>
              </View>
            </View>
          );
        })
      ) : (
        <View style={{padding: 16, alignItems: 'center'}}>
          <Text>No Data Record.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default History;
