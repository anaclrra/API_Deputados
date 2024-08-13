import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, ActivityIndicator} from 'react-native';
import { Button} from 'react-native-paper';

const DeputadosList = () => {
    const [deputados, setDeputados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    const [uf, setUf] = useState('');
    const [partido, setPartido] = useState('');
  

    useEffect(() => {
        fetchDeputados();
      }, []);
      
    const fetchDeputados = async () => {
      const API = 'https://dadosabertos.camara.leg.br/api/v2/deputados';
      setLoading(true);
      try {
       const queryParams = new URLSearchParams({
        ...(nome && { nome }),
        ...(uf && { siglaUf: uf }),
        ...(partido && { siglaPartido: partido }),
          ordem: 'asc',
          itens: 25
        }).toString();
  
        const response = await fetch(`${API}?${queryParams}`);
        
        const data = await response.json();
        setDeputados(data.dados);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar deputados:', error);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Filtrar Deputados</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sigla do estado (UF)"
          value={uf}
          onChangeText={setUf}
        />
        <TextInput
          style={styles.input}
          placeholder="Sigla do partido"
          value={partido}
          onChangeText={setPartido}
        />
        <Button
          mode="contained"
          onPress={fetchDeputados}
          style={styles.button}
        >Filtrar</Button>

        {loading ? (
                <View style={styles.load}>
                    <ActivityIndicator size="large" color="#a569bd" />
                </View>
        ) : (
            <FlatList
            data={deputados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                <Image
                    source={{ uri: item.urlFoto }}
                    style={styles.photo}
                />
                <View>
                    <Text style={styles.name}>{item.nome}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text>{item.siglaPartido} - {item.siglaUf}</Text>
                </View>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.noResults}>Nenhum deputado encontrado</Text>}
            />
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    textAlign:'center'
  },
  button:{
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderBottomColor: '#8e44ad',
    borderBottomWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,  
    borderWidth: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 12,
    color: 'gray',
  },
  load: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  noResults: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
},
});

export default DeputadosList;
