// Import Solana web3 functinalities
const {
        Connection,
        PublicKey,
        clusterApiUrl,
        Keypair,
        LAMPORTS_PER_SOL,
        Transaction,
        SystemProgram,
        sendAndConfirmRawTransaction,
        sendAndConfirmTransaction
    } = require("@solana/web3.js");
    
    const DEMO_FROM_SECRET_KEY = new Uint8Array(
        [
                226, 121,  76, 244,  36,  17,  60, 199,  55, 220,  91,
                132,  15, 180, 112, 203, 156, 127,   3, 115, 144, 117,
                 98,  77, 103,  98, 184,  40, 229, 146, 149,  47, 187,
                 35, 244,  76,  47,  12,  78,  12,  83, 153,  43, 202,
                242,  75,  59, 103, 227,  38,  88, 250, 160, 162, 156,
                216, 220, 164,  97, 204, 254,  21,  40, 213
          ]            
    );
    


    const transferSol = async() => {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
        // Get Keypair from Secret Key
        var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    
        // Other things to try: 
        // 1) Form array from userSecretKey
        // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
        // 2) Make a new Keypair (starts with 0 SOL)
        // const from = Keypair.generate();
    
        // Generate another Keypair (account we'll be sending to)
        const to = Keypair.generate();
    
        //get from-wallet balance
        const from_walletBalance = await connection.getBalance(
                new PublicKey(from.publicKey)
             );
             console.log(`from Wallet balance: ${parseInt(from_walletBalance) / LAMPORTS_PER_SOL} SOL`);
        
          //get to-wallet balance
          const to_walletBalance = await connection.getBalance(
      
                new PublicKey(to.publicKey)
             );
             console.log(`to Wallet balance: ${parseInt(to_walletBalance) / LAMPORTS_PER_SOL} SOL`);
                


        // Aidrop 2 SOL to Sender wallet
        console.log("Airdopping some SOL to Sender wallet!");//
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(from.publicKey),
            2 * LAMPORTS_PER_SOL
        );
    
        // Latest blockhash (unique identifer of the block) of the cluster
        let latestBlockHash = await connection.getLatestBlockhash();
    
        // Confirm transaction using the last valid block height (refers to its time)
        // to check for transaction expiration
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: fromAirDropSignature
        });
    
        console.log("Airdrop completed for the Sender account");//
    
        //check from-wallet balance after airdrop
        const checkFrom_walletBalance = await connection.getBalance(
                new PublicKey(from.publicKey)
             );
             console.log(`from Wallet balance: ${parseInt(checkFrom_walletBalance) / LAMPORTS_PER_SOL} SOL`);
        


        // Send money from "from" wallet and into "to" wallet
        var transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to.publicKey,
                lamports: LAMPORTS_PER_SOL / 100
            })
        );
    
        // Sign transaction
        var signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log('Signature is ', signature);//

        //get from-wallet balance after
        const from_walletBalance_after = await connection.getBalance(
        //new PublicKey(my_wallet)
                new PublicKey(from.publicKey)
     );
        console.log(`from Wallet balance: ${parseInt(from_walletBalance_after) / LAMPORTS_PER_SOL} SOL`);

        //get to-wallet balance after
        const to_walletBalance_after = await connection.getBalance(
        //new PublicKey(my_wallet)
                new PublicKey(to.publicKey)
     );
        console.log(`to Wallet balance: ${parseInt(to_walletBalance_after) / LAMPORTS_PER_SOL} SOL`);
        
    }
    
    transferSol();

    