/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform,
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods
 *  run asynchronous.
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
  // Constructor - argument data will be the object containing the transaction data
  constructor(data) {
    this.hash = null; // Hash of the block
    this.height = 0; // Block Height (consecutive number of each block)
    this.body = Buffer(JSON.stringify(data)).toString('hex'); // Will contain the transactions stored in the block, by default it will encode the data
    this.time = 0; // Timestamp for the Block creation
    this.previousBlockHash = null; // Reference to the previous Block Hash
  }

  /**
   *  validate() method will validate if the block has been tampered or not.
   *  Been tampered means that someone from outside the application tried to change
   *  values in the block data as a consequence the hash of the block should be different.
   */
  validate() {
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        // Save in auxiliary variable the current block hash
        const currentHash = self.hash;

        const testBlock = { ...self };
        testBlock.hash = null;

        // Recalculate the hash of the Block
        const blockHash = SHA256(JSON.stringify(testBlock)).toString();

        // Comparing if the hashes changed
        // Returning the Block is valid or not
        resolve(currentHash === blockHash);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   *  Auxiliary Method to return the block body (decoding the data)
   */
  getBData() {
    // Getting the encoded data saved in the Block
    const self = this;

    return new Promise((resolve, reject) => {
      try {
        // Decoding the data to retrieve the JSON representation of the object
        // Parse the data to an object to be retrieve.
        const decoded = JSON.parse(hex2ascii(self.body));

        // Resolve with the data if the object isn't the Genesis block
        if (decoded.data !== 'Genesis Block') {
          resolve(decoded);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports.Block = Block; // Exposing the Block class as a module
