import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ColetaDeDados: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>Não há dados no momento.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    message: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});

export default ColetaDeDados;
