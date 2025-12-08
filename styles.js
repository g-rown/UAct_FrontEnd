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
        padding: 20,
        borderRadius: 8,
        width: '97%',
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    
    header: {
        fontSize: 28,            
        fontWeight: '700',          
        marginBottom: 20,         
        textAlign: 'center',      
    },

    input: {
        borderWidth: 1,
        borderColor: "#817f7fff",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },

    linkText: {
        color: "#011C40",
        fontWeight: "bold",
    },

    footerText: { 
        textAlign: "center", 
        marginTop: 15,
        color: "#011C40",
        fontWeight: 400
    },

    button: { 
        backgroundColor: "#011C40", 
        padding: 15, 
        borderRadius: 8, 
        alignItems: "center", 
        marginTop: 10,
        
    },

    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    link: { textAlign: "center", marginTop: 15, color: "#011C40" },

    img: {
        alignSelf: 'center',
        height: 84,
        width: 250,
    },

    loadingScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingScreenText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },


    /* ======================================
       COMMUNITY PROGRAMS PAGE STYLES
       ====================================== */
    cpContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    cpTitle: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#011C40",
    
    },
    cpCard: {
        backgroundColor: "#ffffff",
        padding: 18,
        marginVertical: 10,
        borderRadius: 12,
        elevation: 4,
    },
    cpProgramTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#011C40",
    },
    cpText: {
        fontSize: 15,
        marginVertical: 1,
        color: "#333",
    },
    cpApplyBtn: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: "#cf1a24",
    },
    cpApplyBtnText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },

    /* ======================================
          PROGRAM APPLICATION PAGE STYLES
       ====================================== */
    paContainer: {
        padding: 20,
        backgroundColor: "#f5f5f5",
        flex: 1,
    },

    paTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#011C40",
    },

    paProgramCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 3,
    },

    paProgramHeader: {
        fontWeight: "bold",
        color: "#011C40",
        marginBottom: 5,
        fontSize: 16,
    },

    paText: {
        fontSize: 15,
        marginVertical: 2,
    },

    paField: {
        marginTop: 15,
    },

    paLabel: {
        fontWeight: "bold",
        marginBottom: 5,
        color: "#011C40",
    },

    paInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        backgroundColor: "#fff",
    },

    paSubmitBtn: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "#28a745",
        borderRadius: 6,
    },

    paSubmitBtnDisabled: {
        backgroundColor: "#6c757d",
    },

    paSubmitBtnText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },

      /* ---------------------------------------------------------
       SERVICE HISTORY PAGE STYLES 
    --------------------------------------------------------- */

    itemContainer: {
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        width: '100%',
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    detailText: {
        fontSize: 15,
        color: "#333",
        marginBottom: 3,
    },

    emptyText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
        color: "#777",
    },

    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
        fontSize: 16,
        fontWeight: "bold",
    },

    center: {
        justifyContent: "center",
        alignItems: "center",
    },


    signupButton: {
        backgroundColor: "#011C40",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,

    },

    signupButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    }, 

    /* ---------------------------------------------------------
       STUDENT DASHBOARD PAGE STYLES
    --------------------------------------------------------- */

    dashboardWelcome: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        textShadowColor: '#011C40',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },

    dashboardButton: {
        backgroundColor: '#011C40',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        elevation: 3,
        height: 120
    },

    dashboardButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center'
    },

        /* ---------------------------------------------------------
       LOGIN PAGE STYLES 
    --------------------------------------------------------- */

    loginCard: {
        backgroundColor: "rgba(255,255,255,0.92)",
        padding: 25,
        width: "88%",
        borderRadius: 12,
        alignSelf: "center",
        elevation: 5,
        marginTop: 30,
        marginBotton: 20
    },

    loginHeader: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        color: "#011C40",
    },

    loginInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },

    loginButton: {
        backgroundColor: "#011C40",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,

    },

    loginButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    loginFooter: {
        textAlign: "center",
        marginTop: 15,
        color: "#011C40",
        fontSize: 14,
        fontWeight: 400
    },

    loginFooterLink: {
        color: "#011C40",
        fontWeight: "700",
    },

    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingLeft: 5,
    },
    checkbox: {
        height: 16,
        width: 16,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: '#011C40',
        marginRight: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#011C40',
    },
    checkmark: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    rememberMeText: {
        fontSize: 14,
        paddingBottom: 2,
        color: '#333',
    },

    /* ---------------------------------------------------------
        ADMIN DASHBOARD PAGE STYLES
    --------------------------------------------------------- */
    adminDashboardWelcome: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },

    adminDashboardButton: {
        backgroundColor: '#011C40',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        marginVertical: 10,
        elevation: 3,
    },

    adminDashboardButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    buttonContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginBottom: 10, 
        gap: 20
    },
    
    halfButton: {
        backgroundColor: '#011C40',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        elevation: 3,
        height: 120,
        flex: 1, 
        width: undefined, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: 0, 
    },

    halfButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center'
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#011C40',
    },
        /* ---------------------------------------------------------
        SIGNUP PAGE STYLES
    --------------------------------------------------------- */

    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop:30
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        color: '#011C40',
    },

    signupButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },

    /* ---------------------------------------------------------
   MANAGE STUDENTS PAGE STYLES
--------------------------------------------------------- */

manageMainContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
},

manageContentBox: {
    width: '80%',
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
},

manageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#001e66',
},

manageHeaderText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'DM Sans',
},

studentScroll: {
    flex: 1,
    paddingHorizontal: 20,
},

studentScrollContent: {
    paddingVertical: 20,
},

noStudentText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
    fontFamily: 'DM Sans',
},

studentCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
},

studentName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#001e66',
    fontFamily: 'DM Sans',
},

studentInfoBox: {
    marginLeft: 5,
    marginBottom: 10,
},

studentInfoText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'DM Sans',
},

buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
},

editButton: {
    backgroundColor: '#001e66',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
},

deleteButton: {
    backgroundColor: '#cf1a24',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
},

buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
},

/* ------------------ LOADING / ERROR ------------------ */

loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

loadingText: {
    marginTop: 10,
    fontFamily: 'DM Sans',
},

errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

errorText: {
    color: '#cf1a24',
    marginBottom: 10,
    fontFamily: 'DM Sans',
},

goToLoginText: {
    color: '#001e66',
    fontWeight: '600',
    fontFamily: 'DM Sans',
},

/* ------------------ MODAL ------------------ */

modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
},

modalBox: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    elevation: 10,
},

modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#001e66',
    fontFamily: 'DM Sans',
},

modalMessage: {
    fontSize: 15,
    marginBottom: 20,
    fontFamily: 'DM Sans',
},

modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
},

modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ccc',
},

modalCancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
},

modalDeleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#cf1a24',
},

modalDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'DM Sans',
},

    programBarItem: {
    marginBottom: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    },

    
    programNameText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#021c2eff',
    },
    programCountText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
    },
    programBarTrack: {
        height: 12,
        backgroundColor: '#e0e0e0', // Track color (background of the bar)
        borderRadius: 6,
        overflow: 'hidden', // Clip the filling bar
    },
    // Ensure you have these basic card styles too:
    dashboardCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#021c2eff',
        paddingBottom: 5,
    }

});

