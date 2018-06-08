import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalForageService } from 'ngx-localforage';
import Web3 from 'web3';
const shuffle = require('lodash/shuffle');

declare var require;
declare var ethers;
declare var voteToken;
declare var voted;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  public electionsActivated = false;
  public emailsString: string;
  public isBeingVoted = false;
  public loading = true;
  public localData: {
    privateKey?: string;
    address?: string;
    voteToken?: string;
  } = {};
  public parties: any[];
  public selectedParty: any;
  public voted: boolean;
  public web3: any;
  private account: any;
  private myContract: any;
  public hasInvitedFriends = false;

  constructor(
    private localforage: LocalForageService,
    private httpService: HttpClient
  ) {
    this.voted = voted;

    this.web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'));
    this.myContract = new this.web3.eth.Contract([
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "userAddresses",
            "type": "address[]"
          },
          {
            "name": "userTokens",
            "type": "bytes32[]"
          }
        ],
        "name": "addPreviouslyVerifiedAddresses",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "userAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "valueToSend",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "verified",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "success",
            "type": "bool"
          }
        ],
        "name": "VerifiedAddress",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "userAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "kill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "toggleVotingStatus",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "userAddress",
            "type": "address"
          },
          {
            "name": "userToken",
            "type": "string"
          }
        ],
        "name": "verifyAddress",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "partyIndex",
            "type": "uint256"
          }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "addressToToken",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getPartiesCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "partyIndex",
            "type": "uint256"
          }
        ],
        "name": "getPartyResults",
        "outputs": [
          {
            "name": "partyId",
            "type": "uint256"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getPartyResultsOwner",
        "outputs": [
          {
            "name": "partyId",
            "type": "uint256[25]"
          },
          {
            "name": "voteCount",
            "type": "uint256[25]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "partyList",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "source",
            "type": "string"
          }
        ],
        "name": "stringToBytes32",
        "outputs": [
          {
            "name": "result",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "tokenToAddresses",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "verifiedAddresses",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "votedAddresses",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "votedTokens",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "votingInProgress",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ], '0x4764811870aa8c7b5b068b4ccec9f04a1aa4b05b');

    this.loading = true;
    this.myContract.methods.votingInProgress().call()
      .then(res => {
        this.electionsActivated = res;
        this.loading = false;
      });

    const parties = [
      {id: '0', logo: 'lms.png', name: 'Lista Marjana Šarca', abbreviation: 'LMŠ' },
      {id: '1', logo: 'zsi.png', name: 'Zedinjena Slovenija', abbreviation: 'ZSI' },
      {id: '2', logo: 'desus.png', name: 'Demokratična stranka upokojencev', abbreviation: 'DeSUS' },
      {id: '3', logo: 'dobradrzava.png', name: 'Dobra država', abbreviation: 'DD' },
      {id: '4', logo: 'sd.jpg', name: 'Socialni demokrati', abbreviation: 'SD' },
      {id: '5', logo: 'NaprejSlovenija.jpg', name: 'Naprej Slovenija', abbreviation: 'NPS' },
      {id: '6', logo: 'smc.jpg', name: 'Stranka modernega centra', abbreviation: 'SMC' },
      {id: '7', logo: 'ab.jpg', name: 'Stranka Alenke Bratušek', abbreviation: '' },
      {id: '8', logo: 'nsi2.jpg', name: 'Nova Slovenija krščanski demokrati', abbreviation: 'NSi' },
      {id: '9', logo: 'sls.png', name: 'Slovenska ljudska stranka', abbreviation: 'SLS' },
      {id: '10', logo: 'sns.png', name: 'Slovenska nacionalna stranka', abbreviation: 'SNS' },
      {id: '11', logo: 'sds.png', name: 'Slovenska demokratska stranka', abbreviation: 'SDS' },
      {id: '12', logo: 'ac.jpg', name: 'Andrej Čuš in Zeleni Slovenije', abbreviation: '' },
      {id: '13', logo: 'levica.png', name: 'Levica', abbreviation: '' },
      {id: '14', logo: 'zdruzena_levica_in_sloga.png', name: 'Združena levica in sloga', abbreviation: '' },
      {id: '15', logo: 'LNBP.png', name: 'Lista novinarja Bojana Požarja', abbreviation: 'LNBP' },
      {id: '16', logo: 'ssn.png', name: 'Stranka slovenskega naroda', abbreviation: 'SSN' },
      {id: '17', logo: 'Zdruzena_desnica_logo.jpg', name: 'Kangler & Primc Združena desnica - glas za otroke in družine, Nova ljudska stranka Slovenije', abbreviation: 'NLS - NOVA LJUDSKA STRANKA SLOVENIJE' },
      {id: '18', logo: 'pirati.png', name: 'Piratska stranka Slovenije', abbreviation: '' },
      {id: '19', logo: 'zzd.png', name: 'Za zdravo družbo', abbreviation: '' },
      {id: '20', logo: 'gas.png', name: 'Gospodarsko aktivna stranka', abbreviation: 'GAS' },
      {id: '21', logo: 'soc_partija_slovenije.png', name: 'Socialistična partija Slovenije', abbreviation: '' },
      {id: '22', logo: 'solidarnost.png', name: 'Solidarnost, za pravično družbo', abbreviation: '' },
      {id: '23', logo: 'reset.png', name: 'Rešimo Slovenijo elite in tajkunov', abbreviation: 'ReSET' },
      {id: '24', logo: 'gibanjeskupajnaprej.jpg', name: 'Gibanje Skupaj Naprej', abbreviation: 'GSN' },
    ];

    this.parties = shuffle(parties);

    this.checkForLocalData()
    .then(() => {
      this.account = this.web3.eth.accounts.privateKeyToAccount(this.localData.privateKey);
    });
  }

  async checkForLocalData() {
    const localData = await this.localforage.getItem('localData').toPromise();

    if (!localData || localData.voteToken !== voteToken) {
      const wallet = ethers.Wallet.createRandom();

      this.localData = {
        privateKey: wallet.privateKey,
        address: wallet.address,
        voteToken: voteToken
      };

      await this.localforage.setItem('localData', this.localData).toPromise();

      this.initWallet(this.localData.address, this.localData.voteToken);

    } else {
      this.localData = await this.localforage.getItem('localData').toPromise();
    }
  }

  async initWallet(address, _voteToken) {
    const response = await this.httpService.post(`http://localhost:3089/api/v1/wallet/${address}/vote/${_voteToken}/init`, {}).toPromise();
  }

  async vote() {
    this.isBeingVoted = true;

    this.web3.eth.getBalance(this.localData.address)
        .then(res => {
          if (res > 0) {
            console.log('Balance: ', res);
            this.publishVote();
          } else {
            setTimeout(() => {
                this.vote();
            }, 1000);
          }
        });

  }

  async publishVote() {
      const data = this.myContract.methods.vote(this.selectedParty.id).encodeABI();

      const signedTransactionData = await this.account.signTransaction({
          to: '0x4764811870aa8c7b5b068b4ccec9f04a1aa4b05b',
          data: data,
          gas: '200000',
          value: '0'
      });

      return new Promise((resolve, reject) => {
          this.web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction, (err, result) => {
              if (err) { reject(err); }

              resolve(result);
          });
      })
      .then(res => {
          return this.httpService.post(`http://localhost:3089/api/v1/vote/${this.localData.voteToken}`, {}).toPromise();
      })
      .then(res => {
          this.voted = res as boolean;
          this.isBeingVoted = false;

          setTimeout(() => {
              window.scrollTo(0, 0);
          });
      })
      .catch(err => {
          this.isBeingVoted = false;
          console.log(err);
      });
  }

  inviteFriends() {
    if (!this.emailsString) {
      this.emailsString = '';
    }

    this.hasInvitedFriends = false;

    const emailStringsArray = this.emailsString.split(/[ ,]+/);
    const emails = emailStringsArray.filter(email => this.validateEmail(email));

    if (emails.length === 0) {
      return;
    }

    this.httpService.post(`http://localhost:3089/api/v1/inviteFriends`, { emails }).toPromise()
        .then(res => {
            this.emailsString = '';
            this.hasInvitedFriends = true;
        });
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  openFacebookShareDialog() {
    const url = 'https://volitve.principle.network';

    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
      'facebook-share-dialog',
      'width=800,height=600'
    );
  }
}
