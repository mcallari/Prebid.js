import { expect } from 'chai';
import { spec } from 'modules/optimeraBidAdapter';
import { newBidder } from 'src/adapters/bidderFactory';

describe('OptimeraAdapter', () => {
  let adapter = newBidder(spec);

  describe('inherited functions', () => {
    it('exists and is a function', () => {
      expect(adapter.callBids).to.exist.and.to.be.a('function');
    });
  })

  describe('isBidRequestValid', () => {
    let bid = {
      'bidder': 'optimera',
      'params': {
        'custom': {
          'clientID': '0'
        }
      },
      'adUnitCode': 'adunit-code',
      'sizes': [[300, 250], [300, 600]],
      'bidId': '30b31c1838de1e',
      'bidderRequestId': '22edbae2733bf6',
      'auctionId': '1d1a030790a475',
    };

    it('should return true when required params found', () => {
      expect(spec.isBidRequestValid(bid)).to.equal(true);
    });

    let invalidBid = {
      'bidder': 'optimera',
      'params': {},
      'adUnitCode': 'adunit-code',
      'sizes': [[300, 250], [300, 600]],
      'bidId': '30b31c1838de1e',
      'bidderRequestId': '22edbae2733bf6',
      'auctionId': '1d1a030790a475',
    };
    it('should return false when clientID param not found', () => {
      expect(spec.isBidRequestValid(invalidBid)).to.equal(false);
    });
  });

  describe('buildRequests', () => {
    let validBidRequest = [
      {
        'adUnitCode': 'div-0',
        'auctionId': '1ab30503e03994',
        'bidId': '313e0afede8cdb',
        'bidder': 'optimera',
        'bidderRequestId': '202be1ce3f6194',
        'params': {
          'custom': {
            'clientID': '0'
          }
        }
      }
    ];
    it('buildRequests fires', () => {
      let request = spec.buildRequests(validBidRequest);
      expect(request).to.exist;
      expect(request.method).to.equal('GET');
      expect(request.payload).to.exist;
      expect(request.data.t).to.exist;
    });
  })

  describe('interpretResponse', () => {
    let serverResponse = 'window.oVa = {"div-0":["RB_K","728x90K"], "timestamp":["RB_K","1507565666"]};';
    let bidRequest = {
      'method': 'GET',
      'payload': [
        {
          'bidder': 'optimera',
          'params': {
            'custom': {
              'clientID': '0'
            }
          },
          'adUnitCode': 'div-0',
          'bidId': '307440db8538ab'
        }
      ]
    }
    it('interpresResponse fires', () => {
      window.oDv = window.oDv || [];
      let bidResponses = spec.interpretResponse(serverResponse, bidRequest);
      expect(bidResponses[0].dealId[0]).to.equal('RB_K');
      expect(bidResponses[0].dealId[1]).to.equal('728x90K');
    });
  });
});
