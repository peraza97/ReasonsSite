from abc import ABC, abstractmethod

class DbClient(ABC):
    @abstractmethod
    def QueryItems(self, **kwargs):
        pass

    @abstractmethod
    def QueryItem(self, **kwargs):
        pass

    @abstractmethod
    def GetItem(self, key):
        pass
    
    @abstractmethod
    def InsertItem(self, item):
        pass
    
    @abstractmethod
    def UpdateItem(self, item):
        pass
    
    @abstractmethod
    def DeleteItem(self, item):
        pass
    
    @abstractmethod
    def CreateItem(self, **kwargs):
        pass