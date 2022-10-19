package a306.htwm.controller;

import a306.htwm.dto.*;
import a306.htwm.entity.Friend;
import a306.htwm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO registerDTO){
        try{
            userService.register(registerDTO);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/edit")
    public ResponseEntity edit(@RequestBody EditDTO editDTO){
        try{
            userService.edit(editDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("username 이 존재하지 않습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/weight")
    public ResponseEntity weight(@RequestBody WeightDTO weightDTO){
        try{
            userService.weight(weightDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("username 이 존재하지 않습니다.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friend")
    public ResponseEntity acceptFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            userService.acceptFriend(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/friend")
    public ResponseEntity deleteFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            userService.deleteFriend(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/friend")
    public ResponseEntity<ArrayList<FriendDTO>> getFriend(@RequestBody UsernameDTO usernameDTO){
        try{
            return ResponseEntity.ok().body(userService.getFriend(usernameDTO));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
}
