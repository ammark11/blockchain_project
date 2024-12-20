import datetime
import hashlib
import json
import base64
import time
import qrcode
from flask import Flask, jsonify, request, send_file
import requests
from uuid import uuid4
from urllib.parse import urlparse
from flask_cors import CORS
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from functools import wraps
import jwt
from datetime import datetime, timedelta
from vt import Client


class Blockchain:
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.nodes = set()
        self.create_block(proof=1, previous_hash = '0', miner_address = "")


    def create_block(self, proof, previous_hash, miner_address):
        merkle_root = self.calculate_merkle_root(self.transactions)
        block = {
            "index": len(self.chain) + 1,
            "miner": miner_address,
            "timestamp": str(datetime.now()),
            "proof": proof,
            "previous_hash": previous_hash,
            "merkle_root": merkle_root,
            "transactions": self.transactions,
        }
        hash = self.hash(block)
        block["hash"] = hash
        self.transactions = []
        self.chain.append(block)
        return block

    def calculate_merkle_root(self, transactions):
        if len(transactions) == 0:
            return hashlib.sha256(b'').hexdigest()

        if len(transactions) == 1:
            return hashlib.sha256(json.dumps(transactions[0]).encode()).hexdigest()

        # Create a list to hold intermediate hashes
        intermediate_hashes = []

        # Hash each transaction individually and add it to the list
        for transaction in transactions:
            transaction_hash = hashlib.sha256(json.dumps(transaction).encode()).hexdigest()
            intermediate_hashes.append(transaction_hash)

        # Recursively compute the Merkle root from the intermediate hashes
        return self.compute_merkle_root(intermediate_hashes)

    def compute_merkle_root(self, hashes):
        if len(hashes) == 1:
            return hashes[0]

        # Pair up and hash the hashes
        new_hashes = []
        for i in range(0, len(hashes), 2):
            hash1 = hashes[i]
            hash2 = hashes[i + 1] if i + 1 < len(hashes) else hash1
            combined_hash = hashlib.sha256(hash1.encode() + hash2.encode()).hexdigest()
            new_hashes.append(combined_hash)

        # Recursively compute the Merkle root from the new hashes
        return self.compute_merkle_root(new_hashes)

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] == '00000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block["previous_hash"] != self.hash(previous_block):
                return False
            previous_proof = previous_block["proof"]
            proof = block["proof"]
            hash_operation =  hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != "0000":
                return False
            previous_block = block
            block_index += 1
        return True

    def add_transactions(self, sender, recipient, amount, public_key, add_info, file_data):
        self.transactions.append({
            "sender": sender,
            "amount": amount,
            "recipient": public_key,
            "public_key": public_key,
            "add_info": add_info,
            "file_data": file_data
        })
        previous_block = self.get_previous_block()
        return previous_block["index"] + 1

    def update_encrypted_transaction(self, decrypted_file, index, transaction_index):
        try:
            block_index = int(index)
            trans_index = int(transaction_index)
            
            if block_index < len(self.chain):
                block = self.chain[block_index]
                if trans_index < len(block['transactions']):
                    self.chain[block_index]['transactions'][trans_index]['encrypted_file'] = decrypted_file
                    return True
            return False
        except Exception as e:
            print(f"Error updating transaction: {str(e)}")
            return False

    def add_node(self, address):
        paresed_url = urlparse(address)
        self.nodes.add(paresed_url.netloc)

    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()["length"]
                chain = response.json()["chain"]
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False



# Mining Blockchain

app = Flask(__name__)

CORS(app)

def generate_rsa_keys():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')

    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

    return private_pem, public_pem
    
def save_qr_code(data, filename):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)

node_address = str(uuid4()).replace('-', '')

def encrypt_text_data(text_data, recipient_public_key):
    start_time = time.time()
    try:
        print("Original Text Data:", text_data)

        recipient_public_key = serialization.load_pem_public_key(
            recipient_public_key.encode(), backend=default_backend()
        )
        print("Recipient Public Key:", recipient_public_key)

        chunk_size = 256
        chunks = [text_data[i:i + chunk_size] for i in range(0, len(text_data), chunk_size)]

        encrypted_data_chunks = []
        for chunk in chunks:
            encrypted_chunk = recipient_public_key.encrypt(
                chunk.encode(),
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            encrypted_data_chunks.append(encrypted_chunk)

        encrypted_data = b"".join(encrypted_data_chunks)
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time spent on file encryption: {elapsed_time} seconds")

        return base64.b64encode(encrypted_data).decode('utf-8')
    except ValueError as ve:
        print(f"Encryption failed: {ve}")
        return f"Encryption failed: {ve}"
    except Exception as e:
        print(f"Encryption failed: {type(e).__name__} - {e}")
        return str(e)


def decrypt_text_data(encrypted_data, private_key):
    start_time = time.time()

    try:
        private_key = serialization.load_pem_private_key(
            private_key.encode(), password=None, backend=default_backend()
        )
        encrypted_data = base64.b64decode(encrypted_data)

        decrypted_data_chunks = []
        chunk_size = 256
        for i in range(0, len(encrypted_data), chunk_size):
            decrypted_chunk = private_key.decrypt(
                encrypted_data[i:i + chunk_size],
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None,
                ),
            )
            decrypted_data_chunks.append(decrypted_chunk)

        decrypted_data = b"".join(decrypted_data_chunks).decode('utf-8')
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time spent on file decryption: {elapsed_time} seconds")

        return decrypted_data
    except Exception as e:
        print(f"Decryption failed: {type(e).__name__} - {e}")
        return str(e)

blockchain = Blockchain()

JWT_SECRET = 'your-secret-key'  # In production, use environment variable

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = data['public_key']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route("/mine_block", methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    previous_hash = previous_block["hash"]
    proof = blockchain.proof_of_work(previous_proof)
    miner_address = "miner_address"

    block = blockchain.create_block(proof, previous_hash, miner_address)

    response = {
        "message": "Congratulation, you just mined a block!",
        "index": block["index"],
        "timestamp": block["timestamp"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"],
        "transactions": block["transactions"],
    }

    return jsonify(response), 200

@app.route("/get_chain", methods=["GET"])
def get_chain():
    response = {
        "chain": blockchain.chain,
        "active_nodes": list(blockchain.nodes),
        "length": len(blockchain.chain)
    }

    return jsonify(response)

@app.route('/generate_keys', methods=['GET'])
def generate_keys():
    private_key, public_key = generate_rsa_keys()
    return jsonify({'private_key': private_key, 'public_key': public_key})


@app.route("/is_valid", methods=["GET"])
def is_valid():
    is_valid =  blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message': "All Good!. The Blockchain is valid."}
    else:
        response = {'message': "We have a problem. The Blockchain is not valid."}
    return jsonify(response), 200


@app.route("/get_decrypted_data", methods=['POST'])
@token_required
def get_decrypted_data(current_user):
    try:
        json = request.form.to_dict(flat=True)
        transaction_keys = ['private_file', "encrypted_data", "index", "transaction_index"]

        if not all(key in json for key in transaction_keys):
            print("Missing keys:", set(transaction_keys) - set(json.keys()))
            return jsonify({"error": "Missing required fields"}), 400

        block_index = int(json['index'])
        transaction_index = int(json['transaction_index'])
        
        # Get the transaction
        transaction = blockchain.chain[block_index]['transactions'][transaction_index]
        
        # Normalize keys by removing all whitespace and newlines
        normalized_current_user = ''.join(current_user.split())
        normalized_recipient = ''.join(transaction['recipient'].split())

        # Compare normalized keys
        if normalized_current_user != normalized_recipient:
            return jsonify({
                "error": "Unauthorized to decrypt this data",
                "transaction_recipient": transaction['recipient'],
                "current_user": current_user
            }), 403

        decrypted_text_data = decrypt_text_data(json["encrypted_data"], json["private_file"])
        
        # Return decrypted data directly
        return jsonify(decrypted_text_data)

    except Exception as e:
        print("Decryption Error:", str(e))
        return jsonify({"error": str(e)}), 400


VIRUSTOTAL_API_KEY = "c5561a1597122035bc3de121ef8c28628309a261f0390a24b95057e6d29ffb29"

def scan_file_content(file_content):
    try:
        with Client(VIRUSTOTAL_API_KEY) as client:
            print("Creating temporary file for scanning...")
            # Create a temporary file with a unique name
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_content.encode())
                temp_path = temp_file.name

            print("Submitting file for scanning...")
            # Scan the file
            with open(temp_path, 'rb') as f:
                analysis = client.scan_file(f)

            print("Waiting for scan results...")
            # Wait for scan to complete
            time.sleep(15)  # Increased wait time for better results

            try:
                # Get the results
                result = client.get_object("/analyses/{}", analysis.id)
                
                # More detailed results
                if result.stats.get('malicious', 0) > 0:
                    details = f"Detected by {result.stats['malicious']} out of {result.stats.get('total', 0)} scanners"
                    print(f"Malware detected: {details}")
                    return False, f"Malicious file detected: {details}"
                
                print("File scan completed: No threats detected")
                return True, "File is clean"
            
            except Exception as scan_error:
                print(f"Error getting scan results: {str(scan_error)}")
                return False, "Unable to verify file security"

    except Exception as e:
        print(f"Virus scan error: {str(e)}")
        return False, f"Security scan failed: {str(e)}"
    
    finally:
        # Clean up temporary file
        try:
            import os
            os.remove(temp_path)
            print("Temporary file cleaned up")
        except Exception as cleanup_error:
            print(f"Error cleaning up temporary file: {str(cleanup_error)}")

@app.route("/add_transaction", methods=['POST'])
def add_transactions():
    try:
        json = request.form.to_dict(flat=True)
        transaction_keys = ["sender", "recipient", "amount", "public_key", "add_info", 'file']

        if not all(key in json for key in transaction_keys):
            return jsonify({"error": "Some elements of the transaction are missing"}), 400

        # First, scan the file content for viruses
        print("Scanning file for malware...")
        is_clean, message = scan_file_content(json["file"])
        if not is_clean:
            print(f"Malware scan failed: {message}")
            return jsonify({"error": f"File security check failed: {message}"}), 400

        print("File scan passed, proceeding with encryption...")

        # If file is clean, proceed with encryption
        encrypted_text_data = encrypt_text_data(json["file"], json["public_key"])
        if not encrypted_text_data:
            return jsonify({"error": "Encryption failed"}), 400

        # Add transaction to blockchain
        index = blockchain.add_transactions(
            json['sender'],
            json["recipient"],
            json["amount"],
            json["public_key"],
            json["add_info"],
            encrypted_text_data
        )

        response = {
            "message": f"This transaction will be added to Block {index}",
            "security_status": "File scanned and verified clean"
        }
        return jsonify(response), 201

    except Exception as e:
        print(f"Transaction error: {str(e)}")
        return jsonify({"error": f"Failed to process transaction: {str(e)}"}), 400

@app.route("/register_node", methods=['POST'])
def register_node():
    node_address = request.json.get('node_address')
    if not node_address:
        return "Invalid data", 400

    blockchain.add_node(node_address)

    # Optionally, save the node to nodes.json or a database for persistence

    return jsonify({"message": f"Node {node_address} added successfully!"}), 201

@app.route('/heartbeat', methods=['GET'])
def heartbeat():
    return jsonify({'message': 'Node is active'}), 200

def add_node(self, address):
    parsed_url = urlparse(address)
    self.nodes.add(parsed_url.netloc)

    # Check if the node is active
    try:
        response = requests.get(f'http://{parsed_url.netloc}/heartbeat')
        if response.status_code == 200:
            print(f"Node {parsed_url.netloc} is active.")
        else:
            self.nodes.remove(parsed_url.netloc)
            print(f"Node {parsed_url.netloc} is not active.")
    except requests.exceptions.RequestException:
        self.nodes.remove(parsed_url.netloc)
        print(f"Node {parsed_url.netloc} is not active.")

@app.route("/get_nodes", methods=['GET'])
def get_nodes():
    return jsonify({"nodes": list(blockchain.nodes)})


@app.route('/update_transaction', methods=['POST'])
def update_transaction():
    data = request.get_json()
    # Validate data
    # Create a new transaction that references the old one
    # Add logic to handle the new transaction
    # Return a response


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'private_key' not in data:
        return jsonify({'message': 'Missing private key'}), 400
        
    try:
        # Load the private key and derive public key
        private_key = serialization.load_pem_private_key(
            data['private_key'].encode(),
            password=None,
            backend=default_backend()
        )
        public_key = private_key.public_key()
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        
        # Generate token
        token = jwt.encode({
            'public_key': public_pem,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, JWT_SECRET)
        
        return jsonify({'token': token})
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({'message': 'Invalid private key'}), 401

def format_pem_key(key_string):
    """Format a key string into proper PEM format if needed"""
    if not key_string.startswith('-----BEGIN'):
        return key_string
        
    # Split the key into lines and remove empty ones
    lines = [line.strip() for line in key_string.split('\n') if line.strip()]
    
    if len(lines) < 3:  # Must have at least begin, content, and end
        raise ValueError("Invalid PEM format")
        
    # Reconstruct in proper format
    formatted = lines[0] + '\n'  # BEGIN line
    formatted += '\n'.join(lines[1:-1]) + '\n'  # Key content
    formatted += lines[-1] + '\n'  # END line
    
    return formatted

def validate_private_key(key_string):
    """Validate and load a private key"""
    try:
        formatted_key = format_pem_key(key_string)
        private_key = serialization.load_pem_private_key(
            formatted_key.encode(),
            password=None,
            backend=default_backend()
        )
        return private_key
    except Exception as e:
        print(f"Private key validation error: {str(e)}")
        return None

app.run(host='0.0.0.0', port=5000, debug=True)
