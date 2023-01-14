const { Router } = require('express');
const router = Router();
const path = require('path')
const fs = require('fs')
const canonicalize = require('canonicalize')
const jose = require('node-jose')
const crypto = require('crypto')

router.post('/', async (req, res) => {
  const certPath = path.join(__dirname, '../config/cert.pem')
  const cert = fs.readFileSync(certPath)

  const der = cert.toString().replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/(\r\n|\n|\r)/gm, '')

  const header = {
    alg: 'RS256',
    kty: "RS",
    x5c: [der]
  }

  const privateKeyPath = path.join(__dirname, '../config/private-key.pem')
  const privateKey = fs.readFileSync(privateKeyPath)

  const key = await jose.JWK.asKey(privateKey, 'pem')

  const { id, meta, ...rest } = req.body

  const payload = canonicalize(rest)
  const signature = await jose.JWS.createSign({ format: 'compact' }, { key, header }).update(payload).final()
  const base64JWS = Buffer.from(signature).toString('base64');

  const sigElement = {
    type: [
      {
        system: "urn:iso-astm:E1762-95:2013",
        code: "1.2.840.10065.1.12.1.5",
        display: "Verification Signature"
      }
    ],
    when: new Date(),
    who: {
      reference: "https://api.logicahealth.org/DaVinciCDexProvider/open/Practitioner/cdex-example-practitioner"
    },
    onBehalfOf: {
      reference: "https://api.logicahealth.org/DaVinciCDexProvider/open/Organization/cdex-example-provider"
    },
    data: base64JWS,
  }
  
  res.json(sigElement);
});

router.post('/verify', async (req, res) => {
  const publicKeyPath = path.join(__dirname, '../config/public-key.pem')
  const publicKey = fs.readFileSync(publicKeyPath)

  const signature = req.body.signature;//crypto.sign(algorithm, data , privateKey);
  const key = await jose.JWK.asKey(publicKey, 'pem');
  const verifier = jose.JWS.createVerify(key);
  
  const verified = await verifier.verify(signature).catch(()=>{});
	const isVerified = !!verified;
  
  res.json({isVerified})
});

module.exports = router