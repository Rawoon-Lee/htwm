package a306.htwm.controller;

import a306.htwm.dto.EditDTO;
import a306.htwm.dto.FriendDTO;
import a306.htwm.dto.RegisterDTO;
import a306.htwm.dto.WeightDTO;
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
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body("invalid username or uuid");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/edit")
    public ResponseEntity edit(@RequestBody EditDTO editDTO){
        try{
            userService.edit(editDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/weight")
    public ResponseEntity weight(@RequestBody WeightDTO weightDTO){
        try{
            userService.weight(weightDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friend")
    public ResponseEntity acceptFriend(@RequestBody FriendDTO friendDTO){
        try{
            userService.acceptFriend(friendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/friend")
    public ResponseEntity deleteFriend(@RequestBody FriendDTO friendDTO){
        try{
            userService.deleteFriend(friendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/friend")
    public ResponseEntity getFriend(@RequestBody FriendDTO friendDTO){
        ArrayList<Friend> friends;
        try{
            friends = userService.getFriend(friendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest( ).build();
        }
        return ResponseEntity.ok().body(friends);
    }
}
