import hashlib

class Game:
    
    def __init__(self, address):
        self.address = address
        self.answers = None
        self.score = 0

    def getAddress(self):
        return self.address
    
    def getAnswers(self):
        return self.answers
    
    def getScore(self):
        return self.score
    
    def updateAddress(self, address):
        self.address = address
        
    def updateAnswers(self, answers):
        self.answers = answers
        
    def updateScore(self, score):
        # self.score = score
        self.score += score
        
    @staticmethod
    def generate_hash(input):
        return hashlib.sha256(input.encode()).hexdigest()
