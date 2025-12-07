import { StyleSheet } from "react-native";

export default StyleSheet.create({
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    container: { 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20, 
    },    

    card: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignSelf: 'center',
    },

    nobgcard: {
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignSelf: 'center',
    },
    
    header: {
        fontSize: 28,            
        fontWeight: '700',          
        marginBottom: 20,         
        textAlign: 'center',      
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    linkText: {
        color: "#007bff",
        fontWeight: "bold",
    },

    footerText: { 
        textAlign: "center", 
        marginTop: 15,
        color: "#fff",
    },

    button: { backgroundColor: "#0b131dff", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    link: { textAlign: "center", marginTop: 15, color: "#007bff" },

    img: {
        alignSelf: 'center',
        height: 200,
        width: 200,
    },
});
