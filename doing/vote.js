
const gRank = {'H':3, 'L':1, 'M': 0};

Object.freeze(gRank);
function vote(firebase, temaId, vote, prevVote) {
    // sin transaction cheaper, tan cheap?
    const v = vote[0].toUpperCase();
    const userId = firebase.auth().currentUser.uid;

    let  utData = {}; // cheaper sin fecha
    utData[temaId] = v;
    upsert(firebase, `ut/${userId}`, utData);


    let  tuData = {}; // cheaper sin fecha
    tuData[userId] = v;
    upsert(firebase, `tu/${temaId}/`, tuData);

    let r = gRank[v] || 0;
    if(typeof prevVote === 'string' && prevVote.length)
        r -= gRank[prevVote[0].toUpperCase()] || 0;
    if(r) {
        let user = firebase.auth().currentUser;
        //@TODO get nick que selecciono usuario, quitar @emailProvider.com.mx
        let  rData = {nick:user.displayName || user.email || 'Anonymous'}; // cheaper sin fecha
        rData[userId] = r;
        upsert(firebase, "r", rData);
    }
}

function upsert(firebase, path, data) {
    // RT db, cheaper y luego vemos nearby?
    // Modo do & forget, trigger pa reaccionar
    const ref = firebase.database().ref(path);
    ref.update(data)
        .then(() => {
            // Done
        })
        .catch((error) => {
            if(error.code === "INVALID_PATH") {
                // safer create key on register, parece cheaper asi
                ref.set(data)
                    .then(() => {
                        // Done
                    })
                    .catch((error) => {
                        if(true) { //@TODO debe ser if in debug mode
                            console.log("ref ERROR SET:", error);
                            console.log("            path:", path);
                            console.log("            payload:", data);
                            // Failed
                        }
                    });
            }
            else if(true) { //@TODO debe ser if in debug mode
                console.log("ref ERROR UPDATE:", error);
                console.log("            path:", path);
                console.log("            payload:", data);
                // Failed
            }
        });
}
